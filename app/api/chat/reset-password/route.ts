import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {chatPasswords} from '@/lib/db/schema'
import {eq, and, gt} from 'drizzle-orm'
import {hashPassword} from '@/lib/auth/chatAuth'

export async function POST(request: NextRequest) {
  try {
    const {token, newPassword} = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        {error: 'Token and new password are required'},
        {status: 400},
      )
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        {error: 'Password must be at least 4 characters'},
        {status: 400},
      )
    }

    // Look up valid, non-expired token
    const now = new Date()
    const rows = await db
      .select({id: chatPasswords.id})
      .from(chatPasswords)
      .where(
        and(
          eq(chatPasswords.resetToken, token),
          gt(chatPasswords.resetTokenExpiresAt, now),
        ),
      )
      .limit(1)

    if (rows.length === 0) {
      return NextResponse.json(
        {error: 'Invalid or expired reset link'},
        {status: 400},
      )
    }

    // Hash new password and clear the reset token
    const passwordHash = await hashPassword(newPassword)
    await db
      .update(chatPasswords)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(chatPasswords.id, rows[0].id))

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({error: 'Invalid request'}, {status: 400})
  }
}
