import {redirect} from 'next/navigation'
import {getSessionUser} from '@/lib/auth/chatAuth'
import {getConversationsForUser} from '@/lib/auth/chatConversations'
import {db} from '@/lib/db'
import {registrations, chatSessions} from '@/lib/db/schema'
import {ne, eq, gt} from 'drizzle-orm'
import {ChatContainer} from '@/app/components/Chat'

export const metadata = {
  title: 'Chat',
}

export default async function ChatPage() {
  const user = await getSessionUser()
  if (!user) {
    redirect('/chat/login')
  }

  const conversations = (await getConversationsForUser(user.registrationId)).filter((c): c is NonNullable<typeof c> => c !== null)

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const [activeSessions, allAttendeeRows] = await Promise.all([
    db.select({registrationId: chatSessions.registrationId})
      .from(chatSessions)
      .where(gt(chatSessions.lastActiveAt, fiveMinutesAgo)),
    db.select({
      id: registrations.id,
      firstName: registrations.firstName,
      lastName: registrations.lastName,
      title: registrations.title,
      organization: registrations.organization,
      profilePicture: registrations.profilePicture,
      hideInChat: registrations.hideInChat,
    })
      .from(registrations)
      .where(ne(registrations.id, user.registrationId))
      .orderBy(registrations.firstName, registrations.lastName),
  ])

  const onlineSet = new Set(activeSessions.map((s) => s.registrationId))
  const allAttendees = allAttendeeRows
    .filter((a) => !a.hideInChat)
    .map(({hideInChat: _, ...a}) => ({...a, online: onlineSet.has(a.id)}))

  return (
    <div className="mx-auto md:px-4 md:py-6 bg-slate-100">
      <div className="mx-auto h-[calc(100vh-70px)] max-h-[800px] max-w-[1200px] mt-1">
        <ChatContainer initialUser={user} initialConversations={conversations} initialAttendees={allAttendees} />
      </div>
    </div>
  )
}
