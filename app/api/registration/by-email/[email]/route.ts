import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{email: string}>},
) {
  try {
    const {email} = await params
    const decodedEmail = decodeURIComponent(email)

    const result = await db
      .select()
      .from(registrations)
      .where(eq(registrations.email, decodedEmail))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No registration found for this email address.',
        },
        {status: 404},
      )
    }

    const registration = result[0]

    // Return minimal data needed for the activity editing form
    const formattedRegistration = {
      id: registration.id,
      first_name: registration.firstName,
      guest_name: registration.guestName,
      guest_email: registration.guestEmail,
      activities: registration.activities,
      guest_activities: registration.guestActivities,
    }

    return NextResponse.json(
      {
        success: true,
        data: formattedRegistration,
      },
      {status: 200},
    )
  } catch (error: any) {
    console.error('Error fetching registration by email:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch registration',
      },
      {status: 500},
    )
  }
}
