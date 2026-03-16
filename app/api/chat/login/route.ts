import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {
  createChatSession,
  getChatPasswordHash,
  hashPassword,
  setChatPasswordHash,
  verifyPassword,
} from '@/lib/auth/chatAuth'

export async function POST(request: NextRequest) {
  try {
    const {email, password} = await request.json()

    if (!email || !password) {
      return NextResponse.json({error: 'Email and password are required'}, {status: 400})
    }

    // Find the registrant by email
    const users = await db
      .select({
        id: registrations.id,
        firstName: registrations.firstName,
        lastName: registrations.lastName,
        email: registrations.email,
        title: registrations.title,
        organization: registrations.organization,
        profilePicture: registrations.profilePicture,
      })
      .from(registrations)
      .where(eq(registrations.email, email.toLowerCase().trim()))
      .limit(1)

    if (users.length === 0) {
      return NextResponse.json({error: 'No registration found for this email'}, {status: 401})
    }

    const user = users[0]

    // Check if user has a chat password set
    const existingHash = await getChatPasswordHash(user.id)

    if (existingHash) {
      // Verify against stored password
      const valid = await verifyPassword(password, existingHash)
      if (!valid) {
        return NextResponse.json({error: 'Invalid password'}, {status: 401})
      }
    } else {
      // First login — verify against SITE_PASSWORD
      const sitePassword = process.env.SITE_PASSWORD
      if (!sitePassword) {
        return NextResponse.json({error: 'Server configuration error'}, {status: 500})
      }

      if (password !== sitePassword) {
        return NextResponse.json({error: 'Invalid password'}, {status: 401})
      }

      // Hash and store the password for future logins
      const hashed = await hashPassword(password)
      await setChatPasswordHash(user.id, hashed)
    }

    // Create session
    await createChatSession(user.id)

    return NextResponse.json({
      user: {
        registrationId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        title: user.title,
        organization: user.organization,
        profilePicture: user.profilePicture,
      },
    })
  } catch (error) {
    console.error('Chat login error:', error)
    return NextResponse.json({error: 'Invalid request'}, {status: 400})
  }
}
