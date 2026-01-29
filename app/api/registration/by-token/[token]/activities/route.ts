import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {sendActivityUpdateConfirmation} from '@/lib/email/sendEmail'

export async function PATCH(request: NextRequest, {params}: {params: Promise<{token: string}>}) {
  try {
    const {token} = await params
    const formData = await request.json()

    // First verify the token exists and get the registration
    const existing = await db
      .select({id: registrations.id})
      .from(registrations)
      .where(eq(registrations.editToken, token))
      .limit(1)

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired link',
        },
        {status: 404},
      )
    }

    const updateData = {
      activities:
        Array.isArray(formData.activities) && formData.activities.length > 0
          ? formData.activities
          : null,
      guestActivities:
        Array.isArray(formData.guest_activities) && formData.guest_activities.length > 0
          ? formData.guest_activities
          : null,
      updatedAt: new Date(),
    }

    const result = await db
      .update(registrations)
      .set(updateData)
      .where(eq(registrations.editToken, token))
      .returning()

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update activities',
        },
        {status: 500},
      )
    }

    const registration = result[0]

    // Map DB fields to email data format
    const emailData = {
      editToken: registration.editToken,
      first_name: registration.firstName,
      last_name: registration.lastName,
      email: registration.email,
      mobile_phone: registration.mobilePhone || undefined,
      title: registration.title || undefined,
      organization: registration.organization || undefined,
      address_line_1: registration.addressLine1 || undefined,
      address_line_2: registration.addressLine2 || undefined,
      city: registration.city || undefined,
      state: registration.state || undefined,
      zip: registration.zip || undefined,
      country: registration.country || undefined,
      emergency_contact_name: registration.emergencyContactName || undefined,
      emergency_contact_relation: registration.emergencyContactRelation || undefined,
      emergency_contact_phone: registration.emergencyContactPhone || undefined,
      emergency_contact_email: registration.emergencyContactEmail || undefined,
      assistant_name: registration.assistantName || undefined,
      assistant_title: registration.assistantTitle || undefined,
      assistant_email: registration.assistantEmail || undefined,
      assistant_phone: registration.assistantPhone || undefined,
      guest_name: registration.guestName || undefined,
      guest_relation: registration.guestRelation || undefined,
      guest_email: registration.guestEmail || undefined,
      dietary_restrictions: registration.dietaryRestrictions || undefined,
      jacket_size: registration.jacketSize || undefined,
      accommodations: registration.accommodations || undefined,
      dinner_attendance: registration.dinnerAttendance || undefined,
      activities: registration.activities || undefined,
      guest_dietary_restrictions: registration.guestDietaryRestrictions || undefined,
      guest_jacket_size: registration.guestJacketSize || undefined,
      guest_accommodations: registration.guestAccommodations || undefined,
      guest_dinner_attendance: registration.guestDinnerAttendance || undefined,
      guest_activities: registration.guestActivities || undefined,
    }

    // Send confirmation email (don't fail the request if email fails)
    try {
      await sendActivityUpdateConfirmation(emailData)
    } catch (emailError) {
      console.error('Failed to send activity update confirmation email:', emailError)
      // Continue - don't fail the request due to email error
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Activities updated successfully',
        data: {
          activities: result[0].activities,
          guest_activities: result[0].guestActivities,
        },
      },
      {status: 200},
    )
  } catch (error: unknown) {
    console.error('Update activities error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update activities. Please try again.',
      },
      {status: 500},
    )
  }
}
