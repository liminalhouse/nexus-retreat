import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {defineQuery} from 'next-sanity'

const upcomingSessionsQuery = defineQuery(`
  *[_type == "session"] | order(startTime asc) {
    _id,
    id,
    title,
    startTime,
    location,
  }
`)

export async function GET() {
  const sessions = await client.fetch(upcomingSessionsQuery, {}, {next: {revalidate: 60}})
  return NextResponse.json(sessions)
}
