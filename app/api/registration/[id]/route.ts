import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params
    const formData = await request.json()

    // Helper function to convert empty strings to null
    const toNullIfEmpty = (value: any) => {
      if (value === '' || value === undefined) return null
      return value
    }

    // Map form field names to database column names
    const updateData = {
      // Personal Details
      email: formData.email,
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

      // Emergency Contact
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

      // Event Details
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

      // Admin only
      adminNotes: toNullIfEmpty(formData.admin_notes),

      updatedAt: new Date(),
    }

    // Only update admin_notes if explicitly provided (admin users only)
    if (formData.admin_notes !== undefined) {
      updateData.adminNotes = toNullIfEmpty(formData.admin_notes)
    }

    // Update the registration in the database
    const result = await db
      .update(registrations)
      .set(updateData)
      .where(eq(registrations.id, id))
      .returning()

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration not found',
        },
        {status: 404},
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration updated successfully',
        data: result[0],
      },
      {status: 200},
    )
  } catch (error: any) {
    console.error('Update registration error:', error)

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
            ? 'This email is already registered by another user.'
            : 'This information conflicts with an existing registration.',
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
        error: 'Failed to update registration. Please try again.',
      },
      {status: 500},
    )
  }
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params

    // Delete the registration from the database
    const result = await db.delete(registrations).where(eq(registrations.id, id)).returning()

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration not found',
        },
        {status: 404},
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration deleted successfully',
      },
      {status: 200},
    )
  } catch (error: any) {
    console.error('Delete registration error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete registration. Please try again.',
      },
      {status: 500},
    )
  }
}
