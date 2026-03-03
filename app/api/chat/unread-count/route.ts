import {NextResponse} from 'next/server'
import {requireChatAuth} from '@/lib/auth/chatAuth'
import {db} from '@/lib/db'
import {chatMessages} from '@/lib/db/schema'
import {eq, isNull, and, sql} from 'drizzle-orm'

export async function GET() {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const [result] = await db
    .select({count: sql<number>`count(*)::int`})
    .from(chatMessages)
    .where(and(eq(chatMessages.receiverId, user.registrationId), isNull(chatMessages.readAt)))

  return NextResponse.json({count: result.count})
}
