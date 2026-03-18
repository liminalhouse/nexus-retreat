import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {pushSubscriptions} from '@/lib/db/schema'
import {broadcast} from '@/lib/webpush'
import {client} from '@/sanity/lib/client'
import {defineQuery} from 'next-sanity'

// Lean query — only fields needed for notification delivery
const cronSessionsQuery = defineQuery(`
  *[_type == "session"] | order(startTime asc) {
    _id,
    id,
    title,
    startTime,
    location,
  }
`)

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  try {
    const [sessions, subs] = await Promise.all([
      client.fetch(cronSessionsQuery),
      db.select().from(pushSubscriptions),
    ])

    if (subs.length === 0) return NextResponse.json({sent: 0, expired: 0, errors: 0})

    const now = Date.now()
    const windowStart = new Date(now + 13 * 60 * 1000)
    const windowEnd = new Date(now + 17 * 60 * 1000)

    const upcomingSessions = sessions.filter((session: {startTime: string}) => {
      const start = new Date(session.startTime)
      return start >= windowStart && start <= windowEnd
    })

    if (upcomingSessions.length === 0) return NextResponse.json({sent: 0, expired: 0, errors: 0})

    const totals = {sent: 0, expired: 0, errors: 0}
    for (const session of upcomingSessions as {_id: string; title: string; location?: string | null; id?: {current: string}; startTime: string}[]) {
      const counts = await broadcast(subs, {
        title: `Starting soon: ${session.title}`,
        body: `${session.location ?? 'Main Stage'} · in 15 min`,
        tag: session._id,
        url: `/schedule/${session.id?.current ?? ''}`,
      })
      totals.sent += counts.sent
      totals.expired += counts.expired
      totals.errors += counts.errors
    }

    return NextResponse.json(totals)
  } catch (error) {
    console.error('Failed to send push notifications:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
