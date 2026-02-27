import {cookies} from 'next/headers'
import {db} from '@/lib/db'
import {chatSessions, chatPasswords, registrations} from '@/lib/db/schema'
import {eq, and, gt} from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import type {ChatUser} from '@/lib/types/chat'

const COOKIE_NAME = 'chat-token'
const SESSION_DURATION_DAYS = 7

export async function getChatUser(): Promise<ChatUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const now = new Date()
  const sessions = await db
    .select({
      sessionId: chatSessions.id,
      registrationId: chatSessions.registrationId,
      firstName: registrations.firstName,
      lastName: registrations.lastName,
      email: registrations.email,
      title: registrations.title,
      organization: registrations.organization,
      profilePicture: registrations.profilePicture,
    })
    .from(chatSessions)
    .innerJoin(registrations, eq(chatSessions.registrationId, registrations.id))
    .where(and(eq(chatSessions.token, token), gt(chatSessions.expiresAt, now)))
    .limit(1)

  if (sessions.length === 0) return null

  const session = sessions[0]
  return {
    id: session.sessionId,
    registrationId: session.registrationId,
    firstName: session.firstName,
    lastName: session.lastName,
    email: session.email,
    title: session.title,
    organization: session.organization,
    profilePicture: session.profilePicture,
  }
}

export async function requireChatAuth(): Promise<ChatUser | null> {
  const user = await getChatUser()
  if (!user) return null

  // Fire-and-forget: update lastActiveAt for online tracking (don't block response)
  db.update(chatSessions)
    .set({lastActiveAt: new Date()})
    .where(eq(chatSessions.id, user.id))
    .then(() => {})
    .catch(() => {})

  return user
}

export async function createChatSession(registrationId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)

  await db.insert(chatSessions).values({
    registrationId,
    token,
    lastActiveAt: now,
    createdAt: now,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: '/',
  })

  return token
}

export async function deleteChatSession(token: string): Promise<void> {
  await db.delete(chatSessions).where(eq(chatSessions.token, token))
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, 10)
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
}

export async function getChatPasswordHash(registrationId: string): Promise<string | null> {
  const rows = await db
    .select({passwordHash: chatPasswords.passwordHash})
    .from(chatPasswords)
    .where(eq(chatPasswords.registrationId, registrationId))
    .limit(1)

  return rows.length > 0 ? rows[0].passwordHash : null
}

export async function setChatPasswordHash(
  registrationId: string,
  passwordHash: string
): Promise<void> {
  const existing = await getChatPasswordHash(registrationId)
  if (existing) {
    await db
      .update(chatPasswords)
      .set({passwordHash, updatedAt: new Date()})
      .where(eq(chatPasswords.registrationId, registrationId))
  } else {
    await db.insert(chatPasswords).values({registrationId, passwordHash})
  }
}
