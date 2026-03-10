import {NextRequest, NextResponse} from 'next/server'
import webpush from 'web-push'
import {db} from '@/lib/db'
import {pushSubscriptions} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {requireAuth} from '@/lib/auth/requireAuth'

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: NextRequest) {
  await requireAuth('/admin')

  const body = await request.json().catch(() => ({}))
  const title = body.title || 'Test Notification'
  const message = body.message || 'Push notifications are working!'

  const subs = await db.select().from(pushSubscriptions)

  if (subs.length === 0) {
    return NextResponse.json({sent: 0, message: 'No subscribers'})
  }

  const payload = JSON.stringify({
    title,
    body: message,
    tag: `test-${Date.now()}`,
    url: '/schedule',
  })

  let sent = 0
  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {endpoint: sub.endpoint, keys: {p256dh: sub.p256dh, auth: sub.auth}},
          payload,
        )
        sent++
      } catch (err: unknown) {
        const error = err as {statusCode?: number}
        if (error?.statusCode === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint))
        } else {
          throw err
        }
      }
    })
  )

  const errors = results.filter((r) => r.status === 'rejected').length
  return NextResponse.json({sent, errors, total: subs.length})
}
