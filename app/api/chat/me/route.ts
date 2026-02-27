import {NextResponse} from 'next/server'
import {requireChatAuth} from '@/lib/auth/chatAuth'
import {getConversationsForUser} from '@/lib/auth/chatConversations'

export async function GET() {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const conversations = await getConversationsForUser(user.registrationId)

  return NextResponse.json({user, conversations})
}
