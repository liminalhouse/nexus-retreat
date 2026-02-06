import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const {email} = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({exists: false})
    }

    const normalizedEmail = email.toLowerCase().trim()

    const result = await db
      .select({editToken: registrations.editToken})
      .from(registrations)
      .where(eq(registrations.email, normalizedEmail))
      .limit(1)

    console.log('Check email result:', result)

    if (result.length > 0) {
      return NextResponse.json({exists: true, editToken: result[0].editToken})
    }

    return NextResponse.json({exists: false})
  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json({exists: false})
  }
}
