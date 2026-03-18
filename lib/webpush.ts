import webpush from 'web-push'
import {db} from '@/lib/db'
import {pushSubscriptions} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export type PushPayload = {
  title: string
  body: string
  tag: string
  url: string
}

type SendResult = 'sent' | 'expired'

/**
 * Sends a push notification to a single subscription.
 * Returns 'sent' on success, 'expired' if the subscription is gone (410) and
 * removes it from the DB. Throws for all other errors.
 */
export async function sendToSubscription(
  sub: {endpoint: string; p256dh: string; auth: string},
  payload: PushPayload,
): Promise<SendResult> {
  try {
    await webpush.sendNotification(
      {endpoint: sub.endpoint, keys: {p256dh: sub.p256dh, auth: sub.auth}},
      JSON.stringify(payload),
    )
    return 'sent'
  } catch (err: unknown) {
    const error = err as {statusCode?: number}
    if (error?.statusCode === 410) {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint))
      return 'expired'
    }
    throw err
  }
}

/**
 * Broadcasts a push notification to all subscribers.
 * Returns counts of sent, expired, and errored deliveries.
 */
export async function broadcast(
  subs: {endpoint: string; p256dh: string; auth: string}[],
  payload: PushPayload,
) {
  const results = await Promise.allSettled(subs.map((sub) => sendToSubscription(sub, payload)))
  return {
    sent: results.filter((r) => r.status === 'fulfilled' && r.value === 'sent').length,
    expired: results.filter((r) => r.status === 'fulfilled' && r.value === 'expired').length,
    errors: results.filter((r) => r.status === 'rejected').length,
  }
}
