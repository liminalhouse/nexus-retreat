import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {sendActivitySelectionEmail} from '@/lib/email/sendEmail'

export async function POST() {
  try {
    // Fetch all registrations
    const allRegistrations = await db.select().from(registrations)

    if (!allRegistrations || allRegistrations.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No registrations found',
        },
        {status: 404},
      )
    }

    const results: {email: string; success: boolean; error?: string}[] = []

    for (const registration of allRegistrations) {
      // Map camelCase DB fields to snake_case for the email function
      const emailData = {
        first_name: registration.firstName,
        last_name: registration.lastName,
        email: registration.email,
        assistant_email: registration.assistantEmail || undefined,
        guest_email: registration.guestEmail || undefined,
      }

      const result = await sendActivitySelectionEmail(emailData)

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
        message: `Sent ${successCount} emails, ${failCount} failed`,
        total: allRegistrations.length,
        successCount,
        failCount,
        results,
      },
      {status: 200},
    )
  } catch (error: any) {
    console.error('Bulk activity email error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send activity selection emails',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {status: 500},
    )
  }
}
