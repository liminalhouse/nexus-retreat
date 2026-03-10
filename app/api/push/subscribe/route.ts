import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {pushSubscriptions} from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {endpoint, keys} = body

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({error: 'Invalid subscription data'}, {status: 400})
    }

    await db
      .insert(pushSubscriptions)
      .values({endpoint, p256dh: keys.p256dh, auth: keys.auth})
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: {p256dh: keys.p256dh, auth: keys.auth},
      })

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Failed to save push subscription:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
