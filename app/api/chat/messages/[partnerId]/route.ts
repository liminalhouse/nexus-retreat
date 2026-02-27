import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {chatMessages} from '@/lib/db/schema'
import {eq, and, or, lt, desc, isNull} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{partnerId: string}>}
) {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const {partnerId} = await params
  const userId = user.registrationId
  const searchParams = request.nextUrl.searchParams
  const before = searchParams.get('before')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)

  // Build conditions for messages between user and partner
  const betweenCondition = or(
    and(eq(chatMessages.senderId, userId), eq(chatMessages.receiverId, partnerId)),
    and(eq(chatMessages.senderId, partnerId), eq(chatMessages.receiverId, userId))
  )

  const conditions = before
    ? and(betweenCondition, lt(chatMessages.createdAt, new Date(before)))
    : betweenCondition

  const messages = await db
    .select({
      id: chatMessages.id,
      senderId: chatMessages.senderId,
      receiverId: chatMessages.receiverId,
      content: chatMessages.content,
      readAt: chatMessages.readAt,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(conditions!)
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit)

  // Fire-and-forget: mark unread messages from partner as read (don't block response)
  db.update(chatMessages)
    .set({readAt: new Date()})
    .where(
      and(
        eq(chatMessages.senderId, partnerId),
        eq(chatMessages.receiverId, userId),
        isNull(chatMessages.readAt)
      )
    )
    .then(() => {})
    .catch(() => {})

  // Return in chronological order
  const sorted = messages.reverse().map((m) => ({
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    content: m.content,
    readAt: m.readAt?.toISOString() || null,
    createdAt: m.createdAt.toISOString(),
  }))

  return NextResponse.json({messages: sorted, hasMore: messages.length === limit})
}
