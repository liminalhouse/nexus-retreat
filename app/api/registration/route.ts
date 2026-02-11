import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {sendRegistrationConfirmation} from '@/lib/email/sendEmail'

// Generate a secure random token
function generateEditToken(): string {
  return crypto.randomUUID()
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Helper function to convert empty strings to null
    const toNullIfEmpty = (value: any) => {
      if (value === '' || value === undefined) return null
      return value
    }

    // Generate unique edit token
    const editToken = generateEditToken()

    // Map form field names to database column names
    const registrationData = {
      editToken,
      // Step 1: Personal Details
      email: formData.email?.toLowerCase().trim(),
      firstName: formData.first_name,
      lastName: formData.last_name,
      profilePicture: toNullIfEmpty(formData.profile_picture),
      title: toNullIfEmpty(formData.title),
      organization: toNullIfEmpty(formData.organization),
      mobilePhone: formData.mobile_phone,

      // Work Address
      addressLine1: formData.address_line_1,
      addressLine2: toNullIfEmpty(formData.address_line_2),
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,

      // Step 2: Emergency & Contact Information
      emergencyContactName: formData.emergency_contact_name,
      emergencyContactRelation: toNullIfEmpty(formData.emergency_contact_relation),
      emergencyContactEmail: formData.emergency_contact_email,
      emergencyContactPhone: formData.emergency_contact_phone,

      // Executive Assistant
      assistantName: toNullIfEmpty(formData.assistant_name),
      assistantTitle: toNullIfEmpty(formData.assistant_title),
      assistantEmail: toNullIfEmpty(formData.assistant_email),
      assistantPhone: toNullIfEmpty(formData.assistant_phone),

      // Guest Information
      guestName: toNullIfEmpty(formData.guest_name),
      guestRelation: toNullIfEmpty(formData.guest_relation),
      guestEmail: toNullIfEmpty(formData.guest_email),

      // Step 3: Event Details (arrays stored as JSONB)
      dietaryRestrictions: toNullIfEmpty(formData.dietary_restrictions),
      jacketSize: toNullIfEmpty(formData.jacket_size),
      accommodations:
        Array.isArray(formData.accommodations) && formData.accommodations.length > 0
          ? formData.accommodations
          : null,
      dinnerAttendance:
        Array.isArray(formData.dinner_attendance) && formData.dinner_attendance.length > 0
          ? formData.dinner_attendance
          : null,
      activities:
        Array.isArray(formData.activities) && formData.activities.length > 0
          ? formData.activities
          : null,

      // Guest Event Details
      guestDietaryRestrictions: toNullIfEmpty(formData.guest_dietary_restrictions),
      guestJacketSize: toNullIfEmpty(formData.guest_jacket_size),
      guestAccommodations:
        Array.isArray(formData.guest_accommodations) && formData.guest_accommodations.length > 0
          ? formData.guest_accommodations
          : null,
      guestDinnerAttendance:
        Array.isArray(formData.guest_dinner_attendance) &&
        formData.guest_dinner_attendance.length > 0
          ? formData.guest_dinner_attendance
          : null,
      guestActivities:
        Array.isArray(formData.guest_activities) && formData.guest_activities.length > 0
          ? formData.guest_activities
          : null,
    }

    // Insert into database using Drizzle ORM
    const result = await db.insert(registrations).values(registrationData).returning()

    // Send confirmation email
    const emailResult = await sendRegistrationConfirmation({
      ...formData,
      editToken,
    })

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error)
      // Don't fail the registration if email fails, just log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration submitted successfully',
        data: result[0],
        editToken,
      },
      {status: 201},
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    // Drizzle ORM wraps PostgreSQL errors in a cause property
    const pgError = error.cause || error

    // Handle unique constraint violation (duplicate email)
    if (pgError.code === '23505') {
      const constraintName = pgError.constraint_name || pgError.constraint
      const isDuplicateEmail = constraintName === 'registrations_email_unique'

      return NextResponse.json(
        {
          success: false,
          error: isDuplicateEmail
            ? 'This email has already been registered. Please contact us at info@nexus-retreat.com for assistance.'
            : 'This information has already been registered. Please contact us at info@nexus-retreat.com for assistance.',
        },
        {status: 400},
      )
    }

    // Handle not null constraint violations
    if (pgError.code === '23502') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        {status: 400},
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit registration. Please try again.',
      },
      {status: 500},
    )
  }
}
