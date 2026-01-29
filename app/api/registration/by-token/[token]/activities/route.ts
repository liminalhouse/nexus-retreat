import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {sendActivityUpdateConfirmation} from '@/lib/email/sendEmail'
import {mapRegistrationToEmailData} from '@/lib/utils/mapRegistrationToEmail'
import {ACTIVITY_OPTIONS} from '@/lib/utils/formatRegistrationFields'

// Valid activity values for validation
const VALID_ACTIVITY_VALUES = new Set(ACTIVITY_OPTIONS.map((opt) => opt.value))

function validateActivities(activities: unknown): string[] | null {
  if (!Array.isArray(activities)) return null
  if (activities.length === 0) return null

  // Filter to only valid activity values
  const validActivities = activities.filter(
    (a): a is string => typeof a === 'string' && VALID_ACTIVITY_VALUES.has(a),
  )

  return validActivities.length > 0 ? validActivities : null
}

export async function PATCH(request: NextRequest, {params}: {params: Promise<{token: string}>}) {
  try {
    const {token} = await params
    const formData = await request.json()

    const updateData = {
      activities: validateActivities(formData.activities),
      guestActivities: validateActivities(formData.guest_activities),
      updatedAt: new Date(),
    }

    // Single query: update and return in one operation
    const result = await db
      .update(registrations)
      .set(updateData)
      .where(eq(registrations.editToken, token))
      .returning()

    // If no rows updated, the token was invalid
    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired link',
        },
        {status: 404},
      )
    }

    const registration = result[0]
    const emailData = mapRegistrationToEmailData(registration)

    // Send confirmation email (don't fail the request if email fails)
    try {
      await sendActivityUpdateConfirmation(emailData)
    } catch (emailError) {
      console.error('Failed to send activity update confirmation email:', emailError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Activities updated successfully',
        data: {
          activities: registration.activities,
          guest_activities: registration.guestActivities,
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
