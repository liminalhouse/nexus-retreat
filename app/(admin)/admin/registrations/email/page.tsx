import {db} from '@/lib/db'
import {registrations as registrationsTable} from '@/lib/db/schema'
import {desc} from 'drizzle-orm'
import Link from 'next/link'
import EmailPageClient from './EmailPageClient'

export const dynamic = 'force-dynamic'

export default async function EmailRegistrantsPage() {
  let registrations: any[] = []
  let error: Error | null = null

  try {
    const results = await db
      .select()
      .from(registrationsTable)
      .orderBy(desc(registrationsTable.createdAt))

    // Pass all registration data for preview
    registrations = results
  } catch (err) {
    console.error('Error fetching registrations:', err)
    error = err instanceof Error ? err : new Error('Failed to fetch registrations')
  }

  return (
    <div className="mx-2 md:mx-4 lg:mx-6 px-4 mt-10 mb-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Registrants</h1>
          <p className="text-gray-600">
            Send custom emails to selected registrants
          </p>
        </div>
        <Link
          href="/admin/registrations"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to List
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Error loading registrations: {error.message}
        </div>
      )}

      {registrations && registrations.length > 0 ? (
        <EmailPageClient registrations={registrations} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No registrations found</p>
        </div>
      )}
    </div>
  )
}
