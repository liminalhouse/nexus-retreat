import {NextRequest, NextResponse} from 'next/server'
import crypto from 'crypto'
import {db} from '@/lib/db'
import {registrations, chatPasswords} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {sendPasswordResetEmail} from '@/lib/email/sendEmail'

export async function POST(request: NextRequest) {
  try {
    const {email} = await request.json()

    if (!email) {
      return NextResponse.json({success: true})
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Look up registration by email
    const users = await db
      .select({
        id: registrations.id,
        firstName: registrations.firstName,
        email: registrations.email,
        assistantEmail: registrations.assistantEmail,
      })
      .from(registrations)
      .where(eq(registrations.email, normalizedEmail))
      .limit(1)

    if (users.length === 0) {
      // Don't leak whether email exists
      return NextResponse.json({success: true})
    }

    const user = users[0]

    // Generate token + 1-hour expiry
    const resetToken = crypto.randomUUID()
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Upsert into chatPasswords
    const existing = await db
      .select({id: chatPasswords.id})
      .from(chatPasswords)
      .where(eq(chatPasswords.registrationId, user.id))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(chatPasswords)
        .set({resetToken, resetTokenExpiresAt, updatedAt: new Date()})
        .where(eq(chatPasswords.registrationId, user.id))
    } else {
      // Create row with a placeholder password hash (user hasn't set password yet)
      // They'll set a real one via the reset flow
      await db.insert(chatPasswords).values({
        registrationId: user.id,
        passwordHash: '__reset_pending__',
        resetToken,
        resetTokenExpiresAt,
      })
    }

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'
    const resetUrl = `${baseUrl}/chat/reset-password?token=${resetToken}`

    // Build CC list (include assistant if exists)
    const cc: string[] = []
    if (user.assistantEmail && user.assistantEmail !== user.email) {
      cc.push(user.assistantEmail)
    }

    const result = await sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstName,
      resetUrl,
      cc: cc.length > 0 ? cc : undefined,
    })

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error)
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({success: true})
  }
}
