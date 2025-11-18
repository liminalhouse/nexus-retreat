import { supabaseAdmin } from '@/lib/supabase/server'
import RegistrationsTable from './RegistrationsTable'
import ExportButton from './ExportButton'

export const dynamic = 'force-dynamic'

export default async function AdminRegistrations() {
  // Fetch registrations from Supabase
  const { data: registrations, error } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching registrations:', error)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Registration Data</h1>
          <p className="text-gray-600">
            {registrations?.length || 0} registration{registrations?.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <ExportButton registrations={registrations || []} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Error loading registrations: {error.message}
        </div>
      )}

      {registrations && registrations.length > 0 ? (
        <RegistrationsTable registrations={registrations} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No registrations yet</p>
        </div>
      )}
    </div>
  )
}
