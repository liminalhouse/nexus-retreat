import { NextRequest, NextResponse } from 'next/server'
import { verifySanityToken, getSanityUserInfo } from '@/lib/sanity/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Verify the token is valid
    const isValid = await verifySanityToken(token)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user info
    const userInfo = await getSanityUserInfo(token)
    if (!userInfo) {
      return NextResponse.json({ error: 'Could not get user info' }, { status: 401 })
    }

    // Set auth cookies
    const cookieStore = await cookies()
    cookieStore.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set('sanity-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

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
