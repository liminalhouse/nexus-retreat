import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {adminNotifications} from '@/lib/db/schema'
import {gt, lt} from 'drizzle-orm'

const MAX_LOOKBACK_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: NextRequest) {
  const since = request.nextUrl.searchParams.get('since')

  // Cap lookback to 24 hours regardless of what the client sends
  const floor = new Date(Date.now() - MAX_LOOKBACK_MS)
  const sinceDate = since
    ? new Date(Math.max(new Date(since).getTime(), floor.getTime()))
    : new Date(Date.now() - 60_000)

  const [notifications] = await Promise.all([
    db
      .select()
      .from(adminNotifications)
      .where(gt(adminNotifications.createdAt, sinceDate))
      .orderBy(adminNotifications.createdAt),
    // Fire-and-forget cleanup of notifications older than 24 hours
    db.delete(adminNotifications).where(lt(adminNotifications.createdAt, floor)),
  ])

  return NextResponse.json(notifications)
}
