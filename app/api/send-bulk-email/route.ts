import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {sendCustomEmail} from '@/lib/email/sendEmail'
import {inArray} from 'drizzle-orm'

type CCOptions = {
  assistants: boolean
  guests: boolean
  infoEmail: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      registrationIds,
      subject,
      body: emailBody,
      headerImageUrl,
      ccOptions,
    }: {
      registrationIds: string[]
      subject: string
      body: string
      headerImageUrl?: string
      ccOptions: CCOptions
    } = body

    // Validate required fields
    if (!registrationIds || registrationIds.length === 0) {
      return NextResponse.json(
        {success: false, error: 'No recipients selected'},
        {status: 400},
      )
    }

    if (!subject || !emailBody) {
      return NextResponse.json(
        {success: false, error: 'Subject and body are required'},
        {status: 400},
      )
    }

    // Fetch selected registrations by IDs
    const selectedRegistrations = await db
      .select()
      .from(registrations)
      .where(inArray(registrations.id, registrationIds))

    if (!selectedRegistrations || selectedRegistrations.length === 0) {
      return NextResponse.json(
        {success: false, error: 'No registrations found for the provided IDs'},
        {status: 404},
      )
    }

    const results: {email: string; success: boolean; error?: string}[] = []

    for (const registration of selectedRegistrations) {
      // Build CC list based on options
      const cc: string[] = []

      if (ccOptions.infoEmail) {
        cc.push('info@nexus-retreat.com')
      }

      if (
        ccOptions.assistants &&
        registration.assistantEmail &&
        registration.assistantEmail !== registration.email
      ) {
        cc.push(registration.assistantEmail)
      }

      if (
        ccOptions.guests &&
        registration.guestEmail &&
        registration.guestEmail !== registration.email &&
        registration.guestEmail !== 'info@nexus-retreat.com'
      ) {
        cc.push(registration.guestEmail)
      }

      // Pass all registration data for variable replacement
      const result = await sendCustomEmail({
        to: registration.email,
        subject,
        body: emailBody,
        headerImageUrl,
        cc: cc.length > 0 ? cc : undefined,
        registration: {
          firstName: registration.firstName,
          lastName: registration.lastName,
          email: registration.email,
          mobilePhone: registration.mobilePhone,
          title: registration.title,
          organization: registration.organization,
          addressLine1: registration.addressLine1,
          addressLine2: registration.addressLine2,
          city: registration.city,
          state: registration.state,
          zip: registration.zip,
          country: registration.country,
          emergencyContactName: registration.emergencyContactName,
          emergencyContactRelation: registration.emergencyContactRelation,
          emergencyContactEmail: registration.emergencyContactEmail,
          emergencyContactPhone: registration.emergencyContactPhone,
          assistantName: registration.assistantName,
          assistantTitle: registration.assistantTitle,
          assistantEmail: registration.assistantEmail,
          assistantPhone: registration.assistantPhone,
          guestName: registration.guestName,
          guestRelation: registration.guestRelation,
          guestEmail: registration.guestEmail,
          dietaryRestrictions: registration.dietaryRestrictions,
          jacketSize: registration.jacketSize,
          accommodations: registration.accommodations,
          dinnerAttendance: registration.dinnerAttendance,
          activities: registration.activities,
          guestDietaryRestrictions: registration.guestDietaryRestrictions,
          guestJacketSize: registration.guestJacketSize,
          guestAccommodations: registration.guestAccommodations,
          guestDinnerAttendance: registration.guestDinnerAttendance,
          guestActivities: registration.guestActivities,
          editToken: registration.editToken,
        },
      })

      results.push({
        email: registration.email,
        success: result.success,
        error: result.success ? undefined : String(result.error),
      })
    }

    const successCount = results.filter((r) => r.success).length
    const failCount = results.filter((r) => !r.success).length

    return NextResponse.json(
      {
        success: true,
        total: selectedRegistrations.length,
        successCount,
        failCount,
        results,
      },
      {status: 200},
    )
  } catch (error: unknown) {
    console.error('Bulk email error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send emails',
        details:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      {status: 500},
    )
  }
}
