import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {sendActivitySelectionEmail} from '@/lib/email/sendEmail'

export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization via secret header
    const authHeader = request.headers.get('x-admin-secret')
    if (authHeader !== process.env.ADMIN_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        {status: 401},
      )
    }

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

    // Send emails sequentially with delay to respect Resend's 2 req/sec rate limit
    const DELAY_MS = 600 // 600ms between emails = ~1.6 req/sec (safe margin)
    const results: {email: string; success: boolean; error?: string}[] = []

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    for (const registration of allRegistrations) {
      const emailData = {
        first_name: registration.firstName,
        last_name: registration.lastName,
        email: registration.email,
        editToken: registration.editToken,
        assistant_email: registration.assistantEmail || undefined,
        guest_email: registration.guestEmail || undefined,
      }

      try {
        const result = await sendActivitySelectionEmail(emailData)
        results.push({
          email: registration.email,
          success: result.success,
          error: result.success ? undefined : String(result.error),
        })
      } catch (err) {
        results.push({
          email: registration.email,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }

      // Wait before sending next email to respect rate limit
      await delay(DELAY_MS)
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
  } catch (error: unknown) {
    console.error('Bulk activity email error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send activity selection emails',
        details:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      {status: 500},
    )
  }
}
