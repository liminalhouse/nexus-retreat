import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params
    const formData = await request.json()

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
