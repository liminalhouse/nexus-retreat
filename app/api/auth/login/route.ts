import {NextRequest, NextResponse} from 'next/server'
import {cookies} from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const {password} = await request.json()

    // Check against environment variable
    const correctPassword = process.env.SITE_PASSWORD

    if (!correctPassword) {
      console.error('SITE_PASSWORD environment variable is not set')
      return NextResponse.json({error: 'Server configuration error'}, {status: 500})
    }

    if (password === correctPassword) {
      // Set authentication cookie
      const cookieStore = await cookies()
      cookieStore.set('auth-token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({success: true})
    } else {
      return NextResponse.json({error: 'Invalid password'}, {status: 401})
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({error: 'Invalid request'}, {status: 400})
  }
}
