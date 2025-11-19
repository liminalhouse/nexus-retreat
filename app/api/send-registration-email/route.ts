import {NextRequest, NextResponse} from 'next/server'
import {sendRegistrationConfirmation} from '@/lib/email/sendEmail'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Email API called ===')
    const formData = await request.json()
    console.log('Form data received:', {
      email: formData.email,
      name: `${formData.first_name} ${formData.last_name}`,
    })

    // Send the registration confirmation email
    console.log('Calling sendRegistrationConfirmation...')
    const result = await sendRegistrationConfirmation(formData)
    console.log('Email result:', result)

    if (result.success) {
      console.log('Email sent successfully!')
      return NextResponse.json(
        {
          success: true,
          message: 'Confirmation email sent successfully',
        },
        {status: 200}
      )
    } else {
      console.error('Email sending failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send confirmation email',
          details: result.error,
        },
        {status: 500}
      )
    }
  } catch (error: any) {
    console.error('Error in send-registration-email API:', error)
    console.error('Error stack:', error.stack)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send confirmation email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {status: 500}
    )
  }
}
