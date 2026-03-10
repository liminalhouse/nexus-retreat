import {NextRequest, NextResponse} from 'next/server'
import webpush from 'web-push'
import {db} from '@/lib/db'
import {adminNotifications, pushSubscriptions} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {requireAuth} from '@/lib/auth/requireAuth'

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: NextRequest) {
  await requireAuth('/admin')

  const {title, message} = await request.json()

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({error: 'Title and message are required'}, {status: 400})
  }

  // Save to DB for in-app polling
  const [notification] = await db
    .insert(adminNotifications)
    .values({title: title.trim(), message: message.trim()})
    .returning()

  // Also send Web Push to all subscribers (background delivery for PWA homescreen)
  const subs = await db.select().from(pushSubscriptions)

  if (subs.length > 0) {
    const payload = JSON.stringify({
      title: title.trim(),
      body: message.trim(),
      tag: `admin-${notification.id}`,
      url: '/schedule',
    })

    await Promise.allSettled(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {endpoint: sub.endpoint, keys: {p256dh: sub.p256dh, auth: sub.auth}},
            payload,
          )
        } catch (err: unknown) {
          const error = err as {statusCode?: number}
          if (error?.statusCode === 410) {
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint))
          }
        }
      }),
    )
  }

  return NextResponse.json(notification)
}
