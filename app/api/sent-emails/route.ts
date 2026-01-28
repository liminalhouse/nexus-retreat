import {NextResponse} from 'next/server'
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    // Fetch emails with higher limit (max is typically 100 per page)
    const allEmails: any[] = []
    let hasMore = true
    let cursor: string | undefined

    // Fetch up to 500 emails (5 pages of 100)
    while (hasMore && allEmails.length < 500) {
      const response = await resend.emails.list({
        limit: 100,
        ...(cursor ? {starting_after: cursor} : {}),
      } as any)

      if (response.error) {
        console.error('Resend API error:', response.error)
        // If we already have some emails, return those
        if (allEmails.length > 0) {
          break
        }
        return NextResponse.json(
          {success: false, error: response.error.message, emails: []},
          {status: 500},
        )
      }

      const emails = response.data?.data || []
      allEmails.push(...emails)

      // Check if there are more pages
      if (emails.length < 100) {
        hasMore = false
      } else {
        // Get cursor for next page (last email's ID)
        cursor = emails[emails.length - 1]?.id
        if (!cursor) {
          hasMore = false
        }
      }
    }

    // Deduplicate emails by ID
    const uniqueEmails = Array.from(
      new Map(allEmails.map((email) => [email.id, email])).values()
    )

    return NextResponse.json({
      success: true,
      emails: uniqueEmails,
    })
  } catch (error) {
    console.error('Error fetching sent emails:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sent emails',
        emails: [],
      },
      {status: 500},
    )
  }
}
