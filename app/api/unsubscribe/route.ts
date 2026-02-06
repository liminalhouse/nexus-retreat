import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {emailUnsubscribes, registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {email} = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {success: false, error: 'Email is required'},
        {status: 400},
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return NextResponse.json(
        {success: false, error: 'Please enter a valid email address'},
        {status: 400},
      )
    }

    // Look up matching registration to populate registrationId
    const matchingRegistration = await db
      .select({id: registrations.id})
      .from(registrations)
      .where(eq(registrations.email, normalizedEmail))
      .limit(1)

    const registrationId = matchingRegistration.length > 0 ? matchingRegistration[0].id : null

    // Insert into email_unsubscribes (ignore if already exists)
    await db
      .insert(emailUnsubscribes)
      .values({
        email: normalizedEmail,
        registrationId,
      })
      .onConflictDoNothing({target: emailUnsubscribes.email})

    return NextResponse.json({success: true})
  } catch (error: unknown) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to process unsubscribe request'},
      {status: 500},
    )
  }
}
