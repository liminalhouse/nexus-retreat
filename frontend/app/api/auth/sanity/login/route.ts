import { NextRequest, NextResponse } from 'next/server'
import { getSanityUserInfo } from '@/lib/sanity/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Get user info (this also validates the token)
    // No need to call verifySanityToken separately - if getSanityUserInfo succeeds, token is valid
    const userInfo = await getSanityUserInfo(token)
    if (!userInfo) {
      return NextResponse.json({ error: 'Invalid token or could not get user info' }, { status: 401 })
    }

    // Set auth cookies
    const cookieStore = await cookies()
    cookieStore.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set('sanity-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log('Cookies set successfully for user:', userInfo.email)

    return NextResponse.json({
      success: true,
      user: {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
