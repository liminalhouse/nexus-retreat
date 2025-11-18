import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Map form field names to database column names
    const registrationData = {
      // Step 1: Personal Details
      email: formData.email,
      firstName: formData.first_name,
      lastName: formData.last_name,
      title: formData.title || null,
      organization: formData.organization || null,
      mobilePhone: formData.mobile_phone,

      // Work Address
      addressLine1: formData.address_line_1,
      addressLine2: formData.address_line_2 || null,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,

      // Step 2: Emergency & Contact Information
      emergencyContactName: formData.emergency_contact_name,
      emergencyContactRelation: formData.emergency_contact_relation || null,
      emergencyContactEmail: formData.emergency_contact_email,
      emergencyContactPhone: formData.emergency_contact_phone,

      // Executive Assistant
      assistantName: formData.assistant_name || null,
      assistantTitle: formData.assistant_title || null,
      assistantEmail: formData.assistant_email || null,
      assistantPhone: formData.assistant_phone || null,

      // Guest Information
      guestName: formData.guest_name || null,
      guestRelation: formData.guest_relation || null,
      guestEmail: formData.guest_email || null,

      // Step 3: Event Details (arrays stored as JSONB)
      dietaryRestrictions: formData.dietary_restrictions || null,
      jacketSize: formData.jacket_size || null,
      accommodations: Array.isArray(formData.accommodations) && formData.accommodations.length > 0
        ? formData.accommodations
        : null,
      dinnerAttendance: Array.isArray(formData.dinner_attendance) && formData.dinner_attendance.length > 0
        ? formData.dinner_attendance
        : null,
      activities: Array.isArray(formData.activities) && formData.activities.length > 0
        ? formData.activities
        : null,

      // Guest Event Details
      guestDietaryRestrictions: formData.guest_dietary_restrictions || null,
      guestJacketSize: formData.guest_jacket_size || null,
      guestAccommodations: Array.isArray(formData.guest_accommodations) && formData.guest_accommodations.length > 0
        ? formData.guest_accommodations
        : null,
      guestDinnerAttendance: Array.isArray(formData.guest_dinner_attendance) && formData.guest_dinner_attendance.length > 0
        ? formData.guest_dinner_attendance
        : null,
      guestActivities: Array.isArray(formData.guest_activities) && formData.guest_activities.length > 0
        ? formData.guest_activities
        : null,
    }

    // Insert into database using Drizzle ORM
    const result = await db.insert(registrations).values(registrationData).returning()

    return NextResponse.json(
      {
        success: true,
        message: 'Registration submitted successfully',
        data: result[0],
      },
      {status: 201}
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: 'This email has already been registered',
        },
        {status: 400}
      )
    }

    // Handle not null constraint violations
    if (error.code === '23502') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: error.message,
        },
        {status: 400}
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit registration',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {status: 500}
    )
  }
}
