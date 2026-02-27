import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {chatMessages, chatSessions, registrations} from '@/lib/db/schema'
import {eq, or, and, gt, sql, isNull} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function GET() {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const userId = user.registrationId
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  // Use raw SQL with DISTINCT ON for efficient "last message per partner" query
  const lastMessages = await db.execute<{
    partner_id: string
    message_id: string
    content: string
    created_at: Date
    sender_id: string
  }>(sql`
    SELECT DISTINCT ON (partner_id)
      CASE WHEN sender_id = ${userId} THEN receiver_id ELSE sender_id END AS partner_id,
      id AS message_id,
      content,
      created_at,
      sender_id
    FROM chat_messages
    WHERE sender_id = ${userId} OR receiver_id = ${userId}
    ORDER BY partner_id, created_at DESC
  `)

  if (lastMessages.length === 0) {
    return NextResponse.json({conversations: []})
  }

  const partnerIds = lastMessages.map((m) => m.partner_id)

  // Run partner details, online status, and unread counts in parallel
  const [partners, activeSessions, unreadRows] = await Promise.all([
    db
      .select({
        id: registrations.id,
        firstName: registrations.firstName,
        lastName: registrations.lastName,
        title: registrations.title,
        organization: registrations.organization,
        profilePicture: registrations.profilePicture,
      })
      .from(registrations)
      .where(sql`${registrations.id} IN ${partnerIds}`),

    db
      .select({registrationId: chatSessions.registrationId})
      .from(chatSessions)
      .where(
        and(
          sql`${chatSessions.registrationId} IN ${partnerIds}`,
          gt(chatSessions.lastActiveAt, fiveMinutesAgo)
        )
      ),

    db
      .select({
        senderId: chatMessages.senderId,
        count: sql<number>`count(*)::int`,
      })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.receiverId, userId),
          isNull(chatMessages.readAt),
          sql`${chatMessages.senderId} IN ${partnerIds}`
        )
      )
      .groupBy(chatMessages.senderId),
  ])

  const onlineSet = new Set(activeSessions.map((s) => s.registrationId))
  const partnerMap = new Map(partners.map((p) => [p.id, p]))
  const unreadMap = new Map(unreadRows.map((r) => [r.senderId, r.count]))

  const conversations = lastMessages
    .map((msg) => {
      const partner = partnerMap.get(msg.partner_id)
      if (!partner) return null

      return {
        partnerId: msg.partner_id,
        partnerName: `${partner.firstName} ${partner.lastName}`,
        partnerTitle: partner.title,
        partnerOrganization: partner.organization,
        partnerPhoto: partner.profilePicture,
        partnerOnline: onlineSet.has(msg.partner_id),
        lastMessage: msg.content,
        lastMessageAt: new Date(msg.created_at).toISOString(),
        lastMessageSenderId: msg.sender_id,
        unreadCount: unreadMap.get(msg.partner_id) || 0,
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.lastMessageAt).getTime() - new Date(a!.lastMessageAt).getTime())

  return NextResponse.json({conversations})
}
