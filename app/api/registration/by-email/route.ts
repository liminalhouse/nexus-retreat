import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {email} = body

    if (!email) {
      return NextResponse.json(
        {success: false, error: 'Email is required'},
        {status: 400}
      )
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim()

    // Fetch registration by email
    const result = await db
      .select({
        id: registrations.id,
        editToken: registrations.editToken,
        firstName: registrations.firstName,
        lastName: registrations.lastName,
        email: registrations.email,
        guestName: registrations.guestName,
        guestEmail: registrations.guestEmail,
        activities: registrations.activities,
        guestActivities: registrations.guestActivities,
      })
      .from(registrations)
      .where(eq(registrations.email, normalizedEmail))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No registration found with this email address',
        },
        {status: 404}
      )
    }

    const registration = result[0]

    return NextResponse.json(
      {
        success: true,
        data: {
          id: registration.id,
          editToken: registration.editToken,
          first_name: registration.firstName,
          last_name: registration.lastName,
          email: registration.email,
          guest_name: registration.guestName,
          guest_email: registration.guestEmail,
          activities: registration.activities,
          guest_activities: registration.guestActivities,
        },
      },
      {status: 200}
    )
  } catch (error: unknown) {
    console.error('Error fetching registration by email:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to look up registration',
      },
      {status: 500}
    )
  }
}
