import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {adminNotifications} from '@/lib/db/schema'
import {gt} from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const since = request.nextUrl.searchParams.get('since')
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 60_000)

  const notifications = await db
    .select()
    .from(adminNotifications)
    .where(gt(adminNotifications.createdAt, sinceDate))
    .orderBy(adminNotifications.createdAt)

  return NextResponse.json(notifications)
}
