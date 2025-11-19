import { NextRequest, NextResponse } from 'next/server'
import { getSanityUserInfo } from '@/lib/sanity/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const userInfo = await getSanityUserInfo(token)
    if (!userInfo) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }

    cookieStore.set('auth-token', 'authenticated', cookieOptions)
    cookieStore.set('sanity-token', token, cookieOptions)

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
