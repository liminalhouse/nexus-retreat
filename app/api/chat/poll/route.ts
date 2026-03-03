import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {chatMessages} from '@/lib/db/schema'
import {eq, or, and, gt, desc} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function GET(request: NextRequest) {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const userId = user.registrationId
  const since = request.nextUrl.searchParams.get('since')
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 30 * 1000)

  const newMessages = await db
    .select({
      id: chatMessages.id,
      senderId: chatMessages.senderId,
      receiverId: chatMessages.receiverId,
      content: chatMessages.content,
      readAt: chatMessages.readAt,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(
      and(
        or(eq(chatMessages.senderId, userId), eq(chatMessages.receiverId, userId)),
        gt(chatMessages.createdAt, sinceDate)
      )
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(100)

  const messages = newMessages.reverse().map((m) => ({
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    content: m.content,
    readAt: m.readAt?.toISOString() || null,
    createdAt: m.createdAt.toISOString(),
  }))

  return NextResponse.json({
    messages,
    timestamp: new Date().toISOString(),
  })
}
