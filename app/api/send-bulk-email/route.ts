import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations, Registration, emailUnsubscribes} from '@/lib/db/schema'
import {sendCustomEmail} from '@/lib/email/sendEmail'
import {inArray, eq} from 'drizzle-orm'

type PredefinedRecipient = 'registrants' | 'executive_assistants' | 'guests' | 'info_email'

type RecipientFieldData = {
  predefined: PredefinedRecipient[]
  custom: string[]
}

type RecipientFields = {
  to: RecipientFieldData
  cc: RecipientFieldData
  bcc: RecipientFieldData
}

// Helper to resolve emails from predefined types for a specific registration
function resolveEmails(
  predefined: PredefinedRecipient[],
  custom: string[],
  registration: Registration | null
): string[] {
  const emails: string[] = [...custom]

  for (const type of predefined) {
    switch (type) {
      case 'registrants':
        if (registration?.email) {
          emails.push(registration.email)
        }
        break
      case 'executive_assistants':
        if (registration?.assistantEmail) {
          emails.push(registration.assistantEmail)
        }
        break
      case 'guests':
        if (registration?.guestEmail) {
          emails.push(registration.guestEmail)
        }
        break
      case 'info_email':
        emails.push('info@nexus-retreat.com')
        break
    }
  }

  // Remove duplicates and filter empty
  return [...new Set(emails.filter(Boolean))]
}

// Check if an email address is unsubscribed
async function isUnsubscribed(email: string): Promise<boolean> {
  const result = await db
    .select({id: emailUnsubscribes.id})
    .from(emailUnsubscribes)
    .where(eq(emailUnsubscribes.email, email.toLowerCase().trim()))
    .limit(1)
  return result.length > 0
}

// Filter out unsubscribed emails from an array
async function filterUnsubscribed(emails: string[]): Promise<{allowed: string[]; blocked: string[]}> {
  const allowed: string[] = []
  const blocked: string[] = []
  for (const email of emails) {
    if (await isUnsubscribed(email)) {
      blocked.push(email)
    } else {
      allowed.push(email)
    }
  }
  return {allowed, blocked}
}

// Check if email is needed based on recipient fields (has registrant-dependent types)
function hasRegistrantDependentTypes(recipientFields: RecipientFields): boolean {
  const registrantTypes: PredefinedRecipient[] = ['registrants', 'executive_assistants', 'guests']
  const allPredefined = [
    ...recipientFields.to.predefined,
    ...recipientFields.cc.predefined,
    ...recipientFields.bcc.predefined,
  ]
  return allPredefined.some((type) => registrantTypes.includes(type))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      registrationIds,
      heading,
      subject,
      body: emailBody,
      headerImageUrl,
      recipientFields,
    }: {
      registrationIds: string[]
      heading?: string
      subject: string
      body: string
      headerImageUrl?: string
      recipientFields: RecipientFields
    } = body

    // Validate required fields
    if (!recipientFields || recipientFields.to.predefined.length === 0 && recipientFields.to.custom.length === 0) {
      return NextResponse.json(
        {success: false, error: 'No recipients specified'},
        {status: 400},
      )
    }

    if (!subject || !emailBody) {
      return NextResponse.json(
        {success: false, error: 'Subject and body are required'},
        {status: 400},
      )
    }

    const needsRegistrations = hasRegistrantDependentTypes(recipientFields)
    let selectedRegistrations: Registration[] = []

    if (needsRegistrations) {
      if (!registrationIds || registrationIds.length === 0) {
        return NextResponse.json(
          {success: false, error: 'No registrations selected for recipient types that require them'},
          {status: 400},
        )
      }

      selectedRegistrations = await db
        .select()
        .from(registrations)
        .where(inArray(registrations.id, registrationIds))

      if (!selectedRegistrations || selectedRegistrations.length === 0) {
        return NextResponse.json(
          {success: false, error: 'No registrations found for the provided IDs'},
          {status: 404},
        )
      }
    }

    const results: {email: string; success: boolean; error?: string; skipped?: boolean}[] = []

    // Rate limit: 600ms between emails to stay under Resend's 2 req/sec limit
    const DELAY_MS = 600
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    if (needsRegistrations) {
      // Send one email per registration
      for (const registration of selectedRegistrations) {
        const toEmails = resolveEmails(recipientFields.to.predefined, recipientFields.to.custom, registration)
        const ccEmails = resolveEmails(recipientFields.cc.predefined, recipientFields.cc.custom, registration)
        const bccEmails = resolveEmails(recipientFields.bcc.predefined, recipientFields.bcc.custom, registration)

        // Filter out unsubscribed emails
        const {allowed: allowedTo, blocked: blockedTo} = await filterUnsubscribed(toEmails)
        const {allowed: allowedCc} = await filterUnsubscribed(ccEmails)
        const {allowed: allowedBcc} = await filterUnsubscribed(bccEmails)

        // Log skipped unsubscribed TO recipients
        for (const blocked of blockedTo) {
          results.push({email: blocked, success: false, skipped: true, error: 'Unsubscribed'})
        }

        // Skip if no TO recipients after filtering
        if (allowedTo.length === 0) {
          continue
        }

        // Remove duplicates across fields
        const filteredCc = allowedCc.filter((e) => !allowedTo.includes(e))
        const filteredBcc = allowedBcc.filter((e) => !allowedTo.includes(e) && !filteredCc.includes(e))

        const result = await sendCustomEmail({
          to: allowedTo[0], // Primary recipient
          heading,
          subject,
          body: emailBody,
          headerImageUrl,
          cc: [...allowedTo.slice(1), ...filteredCc].length > 0 ? [...allowedTo.slice(1), ...filteredCc] : undefined,
          bcc: filteredBcc.length > 0 ? filteredBcc : undefined,
          registration: {
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email,
            mobilePhone: registration.mobilePhone,
            title: registration.title,
            organization: registration.organization,
            city: registration.city,
            state: registration.state,
            guestName: registration.guestName,
            editToken: registration.editToken,
          },
        })

        results.push({
          email: allowedTo.join(', '),
          success: result.success,
          error: result.success ? undefined : String(result.error),
        })

        await delay(DELAY_MS)
      }
    } else {
      // Send a single email with custom recipients only (no registration context)
      const toEmails = resolveEmails(recipientFields.to.predefined, recipientFields.to.custom, null)
      const ccEmails = resolveEmails(recipientFields.cc.predefined, recipientFields.cc.custom, null)
      const bccEmails = resolveEmails(recipientFields.bcc.predefined, recipientFields.bcc.custom, null)

      // Filter out unsubscribed emails
      const {allowed: allowedTo, blocked: blockedTo} = await filterUnsubscribed(toEmails)
      const {allowed: allowedCc} = await filterUnsubscribed(ccEmails)
      const {allowed: allowedBcc} = await filterUnsubscribed(bccEmails)

      for (const blocked of blockedTo) {
        results.push({email: blocked, success: true, error: 'Skipped — unsubscribed'})
      }

      if (allowedTo.length === 0) {
        return NextResponse.json(
          {success: false, error: 'No valid TO recipients (all unsubscribed)'},
          {status: 400},
        )
      }

      const filteredCc = allowedCc.filter((e) => !allowedTo.includes(e))
      const filteredBcc = allowedBcc.filter((e) => !allowedTo.includes(e) && !filteredCc.includes(e))

      const result = await sendCustomEmail({
        to: allowedTo[0],
        heading,
        subject,
        body: emailBody,
        headerImageUrl,
        cc: [...allowedTo.slice(1), ...filteredCc].length > 0 ? [...allowedTo.slice(1), ...filteredCc] : undefined,
        bcc: filteredBcc.length > 0 ? filteredBcc : undefined,
      })

      results.push({
        email: allowedTo.join(', '),
        success: result.success,
        error: result.success ? undefined : String(result.error),
      })
    }

    const successCount = results.filter((r) => r.success).length
    const skippedCount = results.filter((r) => r.skipped).length
    const failCount = results.filter((r) => !r.success && !r.skipped).length

    return NextResponse.json(
      {
        success: true,
        total: results.length,
        successCount,
        skippedCount,
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
