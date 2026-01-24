/**
 * Migration script to convert session times from Pacific Time to Eastern Time.
 *
 * This script assumes times were entered by someone in Pacific Time, but the
 * intended times should be Eastern Time. For example, if someone entered
 * "9:00 AM" while in PT, this should display as "9:00 AM ET" not "12:00 PM ET".
 *
 * Run with: npx tsx scripts/migrate-times-pt-to-et.ts
 *
 * Add --dry-run to preview changes without saving:
 * npx tsx scripts/migrate-times-pt-to-et.ts --dry-run
 */

import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_READ_TOKEN // Needs write access

if (!projectId || !dataset || !token) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_READ_TOKEN are set.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const isDryRun = process.argv.includes('--dry-run')

// Pacific Time is 3 hours behind Eastern Time
// To convert PT -> ET (same clock time), we subtract 3 hours from UTC
const PT_TO_ET_OFFSET_HOURS = 3

async function migrateTimes() {
  console.log(isDryRun ? '🔍 DRY RUN - No changes will be saved\n' : '🚀 Starting migration...\n')

  // Fetch all sessions with times
  const sessions = await client.fetch<Array<{
    _id: string
    title: string
    startTime: string | null
    endTime: string | null
  }>>(`*[_type == "session" && (startTime != null || endTime != null)] {
    _id,
    title,
    startTime,
    endTime
  }`)

  console.log(`Found ${sessions.length} sessions with times\n`)

  for (const session of sessions) {
    console.log(`📅 ${session.title}`)

    const updates: Record<string, string> = {}

    if (session.startTime) {
      const oldStart = new Date(session.startTime)
      const newStart = new Date(oldStart.getTime() - PT_TO_ET_OFFSET_HOURS * 60 * 60 * 1000)
      updates.startTime = newStart.toISOString()

      console.log(`   Start: ${formatForDisplay(oldStart, 'PT')} → ${formatForDisplay(newStart, 'ET')}`)
    }

    if (session.endTime) {
      const oldEnd = new Date(session.endTime)
      const newEnd = new Date(oldEnd.getTime() - PT_TO_ET_OFFSET_HOURS * 60 * 60 * 1000)
      updates.endTime = newEnd.toISOString()

      console.log(`   End:   ${formatForDisplay(oldEnd, 'PT')} → ${formatForDisplay(newEnd, 'ET')}`)
    }

    if (!isDryRun && Object.keys(updates).length > 0) {
      await client.patch(session._id).set(updates).commit()
      console.log(`   ✅ Updated`)
    }

    console.log('')
  }

  if (isDryRun) {
    console.log('🔍 DRY RUN complete. Run without --dry-run to apply changes.')
  } else {
    console.log(`✅ Migration complete! Updated ${sessions.length} sessions.`)
  }
}

function formatForDisplay(date: Date, timezone: 'PT' | 'ET'): string {
  const tz = timezone === 'PT' ? 'America/Los_Angeles' : 'America/New_York'
  return date.toLocaleString('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

migrateTimes().catch(console.error)
