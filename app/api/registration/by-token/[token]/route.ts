import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{token: string}>}
) {
  try {
    const {token} = await params

    // Fetch registration by edit token
    const result = await db
      .select()
      .from(registrations)
      .where(eq(registrations.editToken, token))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired edit link',
        },
        {status: 404}
      )
    }

    const registration = result[0]

    // Map camelCase to snake_case for frontend compatibility
    const formattedRegistration = {
      id: registration.id,
      created_at: registration.createdAt.toISOString(),
      email: registration.email,
      first_name: registration.firstName,
      last_name: registration.lastName,
      title: registration.title,
      organization: registration.organization,
      mobile_phone: registration.mobilePhone,
      address_line_1: registration.addressLine1,
      address_line_2: registration.addressLine2,
      city: registration.city,
      state: registration.state,
      zip: registration.zip,
      country: registration.country,
      emergency_contact_name: registration.emergencyContactName,
      emergency_contact_relation: registration.emergencyContactRelation,
      emergency_contact_email: registration.emergencyContactEmail,
      emergency_contact_phone: registration.emergencyContactPhone,
      assistant_name: registration.assistantName,
      assistant_title: registration.assistantTitle,
      assistant_email: registration.assistantEmail,
      assistant_phone: registration.assistantPhone,
      guest_name: registration.guestName,
      guest_relation: registration.guestRelation,
      guest_email: registration.guestEmail,
      dietary_restrictions: registration.dietaryRestrictions,
      jacket_size: registration.jacketSize,
      accommodations: registration.accommodations,
      dinner_attendance: registration.dinnerAttendance,
      activities: registration.activities,
      guest_dietary_restrictions: registration.guestDietaryRestrictions,
      guest_jacket_size: registration.guestJacketSize,
      guest_accommodations: registration.guestAccommodations,
      guest_dinner_attendance: registration.guestDinnerAttendance,
      guest_activities: registration.guestActivities,
    }

    return NextResponse.json(
      {
        success: true,
        data: formattedRegistration,
      },
      {status: 200}
    )
  } catch (error: any) {
    console.error('Error fetching registration by token:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch registration',
      },
      {status: 500}
    )
  }
}
