import RegistrationsTable from './RegistrationsTable'
import ExportButton from './ExportButton'
import {db} from '@/lib/db'
import {registrations as registrationsTable} from '@/lib/db/schema'
import {desc} from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function AdminRegistrations() {
  let registrations: any[] = []
  let error: Error | null = null

  try {
    // Fetch registrations from database using Drizzle
    const results = await db
      .select()
      .from(registrationsTable)
      .orderBy(desc(registrationsTable.createdAt))

    // Map camelCase fields to snake_case for compatibility with table component
    registrations = results.map((reg) => ({
      id: reg.id,
      created_at: reg.createdAt.toISOString(),
      email: reg.email,
      first_name: reg.firstName,
      last_name: reg.lastName,
      profile_picture: reg.profilePicture,
      title: reg.title,
      organization: reg.organization,
      mobile_phone: reg.mobilePhone,
      address_line_1: reg.addressLine1,
      address_line_2: reg.addressLine2,
      city: reg.city,
      state: reg.state,
      zip: reg.zip,
      country: reg.country,
      emergency_contact_name: reg.emergencyContactName,
      emergency_contact_relation: reg.emergencyContactRelation,
      emergency_contact_email: reg.emergencyContactEmail,
      emergency_contact_phone: reg.emergencyContactPhone,
      assistant_name: reg.assistantName,
      assistant_title: reg.assistantTitle,
      assistant_email: reg.assistantEmail,
      assistant_phone: reg.assistantPhone,
      guest_name: reg.guestName,
      guest_relation: reg.guestRelation,
      guest_email: reg.guestEmail,
      dietary_restrictions: reg.dietaryRestrictions,
      jacket_size: reg.jacketSize,
      accommodations: reg.accommodations,
      dinner_attendance: reg.dinnerAttendance,
      activities: reg.activities,
      guest_dietary_restrictions: reg.guestDietaryRestrictions,
      guest_jacket_size: reg.guestJacketSize,
      guest_accommodations: reg.guestAccommodations,
      guest_dinner_attendance: reg.guestDinnerAttendance,
      guest_activities: reg.guestActivities,
      admin_notes: reg.adminNotes,
      edit_token: reg.editToken,
    }))
  } catch (err) {
    console.error('Error fetching registrations:', err)
    error = err instanceof Error ? err : new Error('Failed to fetch registrations')
  }

  return (
    <>
      <div className="mx-2 md:mx-4 lg:mx-6 px-4 mt-10">
        <div className="mb-6 flex items-start justify-between flex-col gap-4 sm:items-center sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold mb-2">Registration Data</h1>
            <p className="text-gray-600">
              {registrations?.length || 0} registration{registrations?.length !== 1 ? 's' : ''}{' '}
              total
            </p>
          </div>
          <ExportButton registrations={registrations || []} />
        </div>

        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error loading registrations: {error.message}
          </div>
        )}
      </div>
      <div className="overflow-auto w-full mx-auto px-4 mb-16">
        {registrations && registrations.length > 0 ? (
          <RegistrationsTable registrations={registrations} />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No registrations yet</p>
          </div>
        )}
      </div>
    </>
  )
}
