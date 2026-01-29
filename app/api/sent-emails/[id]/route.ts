import {NextRequest, NextResponse} from 'next/server'
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params
    const response = await resend.emails.get(id)

    if (response.error) {
      console.error('Resend API error:', response.error)
      return NextResponse.json(
        {success: false, error: response.error.message},
        {status: 500},
      )
    }

    return NextResponse.json({
      success: true,
      email: response.data,
    })
  } catch (error) {
    console.error('Error fetching email:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch email',
      },
      {status: 500},
    )
  }
}
