import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations, chatSessions} from '@/lib/db/schema'
import {ne, gt, ilike, or, sql} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function GET(request: NextRequest) {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const q = request.nextUrl.searchParams.get('q')?.trim() || ''
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  // Get active session registration IDs for online status
  const activeSessions = await db
    .select({registrationId: chatSessions.registrationId})
    .from(chatSessions)
    .where(gt(chatSessions.lastActiveAt, fiveMinutesAgo))

  const onlineSet = new Set(activeSessions.map((s) => s.registrationId))

  // Build query
  let query = db
    .select({
      id: registrations.id,
      firstName: registrations.firstName,
      lastName: registrations.lastName,
      title: registrations.title,
      organization: registrations.organization,
      profilePicture: registrations.profilePicture,
    })
    .from(registrations)
    .where(ne(registrations.id, user.registrationId))
    .$dynamic()

  if (q) {
    const searchPattern = `%${q}%`
    query = query.where(
      or(
        ilike(registrations.firstName, searchPattern),
        ilike(registrations.lastName, searchPattern),
        ilike(registrations.organization, searchPattern),
        sql`CONCAT(${registrations.firstName}, ' ', ${registrations.lastName}) ILIKE ${searchPattern}`
      )
    )
  }

  const attendees = await query.limit(50)

  const result = attendees.map((a) => ({
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    title: a.title,
    organization: a.organization,
    profilePicture: a.profilePicture,
    online: onlineSet.has(a.id),
  }))

  return NextResponse.json({attendees: result})
}
