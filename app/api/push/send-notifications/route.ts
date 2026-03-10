import {NextRequest, NextResponse} from 'next/server'
import webpush from 'web-push'
import {db} from '@/lib/db'
import {pushSubscriptions} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {client} from '@/sanity/lib/client'
import {sessionsQuery} from '@/sanity/lib/queries'

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  try {
    const sessions = await client.fetch(sessionsQuery)

    const now = Date.now()
    const windowStart = new Date(now + 13 * 60 * 1000)
    const windowEnd = new Date(now + 17 * 60 * 1000)

    const upcomingSessions = sessions.filter((session: {startTime: string}) => {
      const start = new Date(session.startTime)
      return start >= windowStart && start <= windowEnd
    })

    if (upcomingSessions.length === 0) {
      return NextResponse.json({sent: 0})
    }

    const subs = await db.select().from(pushSubscriptions)

    if (subs.length === 0) {
      return NextResponse.json({sent: 0})
    }

    let sent = 0
    const results = await Promise.allSettled(
      upcomingSessions.flatMap((session: {_id: string; title: string; location?: string | null; id?: {current: string}}) =>
        subs.map(async (sub) => {
          const payload = JSON.stringify({
            title: `Starting soon: ${session.title}`,
            body: `${session.location ?? 'Main Stage'} · in 15 min`,
            tag: session._id,
            url: `/schedule/${session.id?.current ?? ''}`,
          })

          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: {p256dh: sub.p256dh, auth: sub.auth},
              },
              payload,
            )
            sent++
          } catch (err: unknown) {
            const error = err as {statusCode?: number}
            if (error?.statusCode === 410) {
              // Subscription expired — remove from DB
              await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint))
            } else {
              throw err
            }
          }
        })
      )
    )

    const errors = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({sent, errors})
  } catch (error) {
    console.error('Failed to send push notifications:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
