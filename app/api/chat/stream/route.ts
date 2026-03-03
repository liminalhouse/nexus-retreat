import {NextRequest} from 'next/server'
import {db} from '@/lib/db'
import {chatMessages, chatSessions} from '@/lib/db/schema'
import {eq, or, and, gt, desc, sql, isNull} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

const STREAM_DURATION_MS = 25_000
const POLL_INTERVAL_MS = 800
const KEEPALIVE_INTERVAL_MS = 10_000

export async function GET(request: NextRequest) {
  const user = await requireChatAuth()
  if (!user) {
    return new Response(JSON.stringify({error: 'Not authenticated'}), {
      status: 401,
      headers: {'Content-Type': 'application/json'},
    })
  }

  const userId = user.registrationId

  // Determine sinceDate: Last-Event-ID header (auto-sent by browser on reconnect) > since param > 30s fallback
  const lastEventId = request.headers.get('last-event-id')
  const sinceParam = request.nextUrl.searchParams.get('since')
  let sinceDate = lastEventId
    ? new Date(lastEventId)
    : sinceParam
      ? new Date(sinceParam)
      : new Date(Date.now() - 30_000)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now()
      let lastKeepaliveTime = Date.now()

      while (true) {
        // Exit: client disconnected or stream lifetime exceeded
        if (request.signal.aborted) break
        if (Date.now() - startTime >= STREAM_DURATION_MS) break

        try {
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

          if (newMessages.length > 0) {
            const now = new Date()
            const nowIso = now.toISOString()
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

            const partnerIdSet = new Set<string>()
            for (const msg of newMessages) {
              partnerIdSet.add(msg.senderId === userId ? msg.receiverId : msg.senderId)
            }
            const partnerIdArray = Array.from(partnerIdSet)

            // Secondary queries run in parallel — only when there are new messages
            const [activeSessions, unreadMessages] = await Promise.all([
              db
                .select({registrationId: chatSessions.registrationId})
                .from(chatSessions)
                .where(
                  and(
                    sql`${chatSessions.registrationId} IN ${partnerIdArray}`,
                    gt(chatSessions.lastActiveAt, fiveMinutesAgo)
                  )
                ),
              db
                .select({senderId: chatMessages.senderId})
                .from(chatMessages)
                .where(
                  and(eq(chatMessages.receiverId, userId), isNull(chatMessages.readAt))
                ),
            ])

            const onlineSet = new Set(activeSessions.map((s) => s.registrationId))

            const unreadCounts: Record<string, number> = {}
            for (const msg of unreadMessages) {
              unreadCounts[msg.senderId] = (unreadCounts[msg.senderId] || 0) + 1
            }

            const onlineStatus: Record<string, boolean> = {}
            for (const pid of partnerIdArray) {
              onlineStatus[pid] = onlineSet.has(pid)
            }

            const messages = newMessages.reverse().map((m) => ({
              id: m.id,
              senderId: m.senderId,
              receiverId: m.receiverId,
              content: m.content,
              readAt: m.readAt?.toISOString() ?? null,
              createdAt: m.createdAt.toISOString(),
            }))

            const payload = JSON.stringify({messages, unreadCounts, onlineStatus, timestamp: nowIso})
            controller.enqueue(encoder.encode(`id: ${nowIso}\nevent: messages\ndata: ${payload}\n\n`))

            sinceDate = now // advance window only when messages are found
            lastKeepaliveTime = Date.now()
          }
        } catch (err) {
          console.error('[SSE] poll error:', err)
          // Continue — transient DB errors should not kill the stream
        }

        // Keepalive comment to prevent proxy/browser from closing idle connections
        if (Date.now() - lastKeepaliveTime >= KEEPALIVE_INTERVAL_MS) {
          controller.enqueue(encoder.encode(`: ping\n\n`))
          lastKeepaliveTime = Date.now()
        }

        await new Promise<void>((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disables Nginx/Vercel proxy buffering — critical for SSE
    },
  })
}
