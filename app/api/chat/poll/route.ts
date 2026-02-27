import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {chatMessages, chatSessions, registrations} from '@/lib/db/schema'
import {eq, or, and, gt, desc, sql, isNull} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function GET(request: NextRequest) {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const userId = user.registrationId
  const since = request.nextUrl.searchParams.get('since')
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 30 * 1000)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  // Get new messages since timestamp
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

  // Derive conversation updates from new messages
  const partnerIds = new Set<string>()
  for (const msg of newMessages) {
    partnerIds.add(msg.senderId === userId ? msg.receiverId : msg.senderId)
  }

  // Get online status for relevant partners
  const partnerIdArray = Array.from(partnerIds)
  let onlineSet = new Set<string>()

  if (partnerIdArray.length > 0) {
    const activeSessions = await db
      .select({registrationId: chatSessions.registrationId})
      .from(chatSessions)
      .where(
        and(
          sql`${chatSessions.registrationId} IN ${partnerIdArray}`,
          gt(chatSessions.lastActiveAt, fiveMinutesAgo)
        )
      )

    onlineSet = new Set(activeSessions.map((s) => s.registrationId))
  }

  // Get unread counts per partner
  const unreadMessages = await db
    .select({
      senderId: chatMessages.senderId,
    })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.receiverId, userId),
        isNull(chatMessages.readAt)
      )
    )

  const unreadCounts = new Map<string, number>()
  for (const msg of unreadMessages) {
    unreadCounts.set(msg.senderId, (unreadCounts.get(msg.senderId) || 0) + 1)
  }

  const messages = newMessages.reverse().map((m) => ({
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    content: m.content,
    readAt: m.readAt?.toISOString() || null,
    createdAt: m.createdAt.toISOString(),
  }))

  // Build partner online status map
  const onlineStatus: Record<string, boolean> = {}
  for (const pid of partnerIdArray) {
    onlineStatus[pid] = onlineSet.has(pid)
  }

  return NextResponse.json({
    messages,
    unreadCounts: Object.fromEntries(unreadCounts),
    onlineStatus,
    timestamp: new Date().toISOString(),
  })
}
