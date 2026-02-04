import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations, Registration} from '@/lib/db/schema'
import {sendCustomEmail} from '@/lib/email/sendEmail'
import {inArray} from 'drizzle-orm'

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
      subject,
      body: emailBody,
      headerImageUrl,
      recipientFields,
    }: {
      registrationIds: string[]
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

    const results: {email: string; success: boolean; error?: string}[] = []

    // Rate limit: 600ms between emails to stay under Resend's 2 req/sec limit
    const DELAY_MS = 600
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    if (needsRegistrations) {
      // Send one email per registration
      for (const registration of selectedRegistrations) {
        const toEmails = resolveEmails(recipientFields.to.predefined, recipientFields.to.custom, registration)
        const ccEmails = resolveEmails(recipientFields.cc.predefined, recipientFields.cc.custom, registration)
        const bccEmails = resolveEmails(recipientFields.bcc.predefined, recipientFields.bcc.custom, registration)

        // Skip if no TO recipients
        if (toEmails.length === 0) {
          continue
        }

        // Remove duplicates across fields
        const filteredCc = ccEmails.filter((e) => !toEmails.includes(e))
        const filteredBcc = bccEmails.filter((e) => !toEmails.includes(e) && !filteredCc.includes(e))

        const result = await sendCustomEmail({
          to: toEmails[0], // Primary recipient
          subject,
          body: emailBody,
          headerImageUrl,
          cc: [...toEmails.slice(1), ...filteredCc].length > 0 ? [...toEmails.slice(1), ...filteredCc] : undefined,
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
          email: toEmails.join(', '),
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

      if (toEmails.length === 0) {
        return NextResponse.json(
          {success: false, error: 'No valid TO recipients'},
          {status: 400},
        )
      }

      const filteredCc = ccEmails.filter((e) => !toEmails.includes(e))
      const filteredBcc = bccEmails.filter((e) => !toEmails.includes(e) && !filteredCc.includes(e))

      const result = await sendCustomEmail({
        to: toEmails[0],
        subject,
        body: emailBody,
        headerImageUrl,
        cc: [...toEmails.slice(1), ...filteredCc].length > 0 ? [...toEmails.slice(1), ...filteredCc] : undefined,
        bcc: filteredBcc.length > 0 ? filteredBcc : undefined,
      })

      results.push({
        email: toEmails.join(', '),
        success: result.success,
        error: result.success ? undefined : String(result.error),
      })
    }

    const successCount = results.filter((r) => r.success).length
    const failCount = results.filter((r) => !r.success).length

    return NextResponse.json(
      {
        success: true,
        total: results.length,
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
