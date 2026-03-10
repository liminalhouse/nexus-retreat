import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {adminNotifications, pushSubscriptions} from '@/lib/db/schema'
import {gt} from 'drizzle-orm'
import {unauthorizedResponse} from '@/lib/auth/checkAuth'
import {broadcast} from '@/lib/webpush'

export async function POST(request: NextRequest) {
  const unauth = await unauthorizedResponse()
  if (unauth) return unauth

  const {title, message} = await request.json()

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({error: 'Title and message are required'}, {status: 400})
  }

  // Rate limit: block if a notification was sent in the last 30 seconds
  const [recent] = await db
    .select()
    .from(adminNotifications)
    .where(gt(adminNotifications.createdAt, new Date(Date.now() - 30_000)))
    .limit(1)

  if (recent) {
    return NextResponse.json(
      {error: 'Please wait a moment before sending another notification'},
      {status: 429},
    )
  }

  // Save to DB for in-app polling
  const [notification] = await db
    .insert(adminNotifications)
    .values({title: title.trim(), message: message.trim()})
    .returning()

  // Broadcast via Web Push for background/homescreen delivery
  const subs = await db.select().from(pushSubscriptions)
  if (subs.length > 0) {
    await broadcast(subs, {
      title: title.trim(),
      body: message.trim(),
      tag: `admin-${notification.id}`,
      url: '/schedule',
    })
  }

  return NextResponse.json(notification)
}
