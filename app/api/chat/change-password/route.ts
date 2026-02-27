import {NextRequest, NextResponse} from 'next/server'
import {
  requireChatAuth,
  getChatPasswordHash,
  verifyPassword,
  hashPassword,
  setChatPasswordHash,
} from '@/lib/auth/chatAuth'

export async function POST(request: NextRequest) {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  try {
    const {currentPassword, newPassword} = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {error: 'Current and new password are required'},
        {status: 400}
      )
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        {error: 'New password must be at least 4 characters'},
        {status: 400}
      )
    }

    // Verify current password
    const existingHash = await getChatPasswordHash(user.registrationId)
    if (existingHash) {
      const valid = await verifyPassword(currentPassword, existingHash)
      if (!valid) {
        return NextResponse.json({error: 'Current password is incorrect'}, {status: 401})
      }
    } else {
      // No password set yet — verify against SITE_PASSWORD
      const sitePassword = process.env.SITE_PASSWORD
      if (currentPassword !== sitePassword) {
        return NextResponse.json({error: 'Current password is incorrect'}, {status: 401})
      }
    }

    // Hash and store new password
    const hashed = await hashPassword(newPassword)
    await setChatPasswordHash(user.registrationId, hashed)

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({error: 'Invalid request'}, {status: 400})
  }
}
