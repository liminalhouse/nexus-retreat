import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {chatMessages, registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function POST(request: NextRequest) {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  try {
    const {receiverId, content} = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json({error: 'receiverId and content are required'}, {status: 400})
    }

    if (content.length > 2000) {
      return NextResponse.json({error: 'Message too long (max 2000 characters)'}, {status: 400})
    }

    if (receiverId === user.registrationId) {
      return NextResponse.json({error: 'Cannot message yourself'}, {status: 400})
    }

    // Verify receiver exists
    const receivers = await db
      .select({id: registrations.id})
      .from(registrations)
      .where(eq(registrations.id, receiverId))
      .limit(1)

    if (receivers.length === 0) {
      return NextResponse.json({error: 'Recipient not found'}, {status: 404})
    }

    const [message] = await db
      .insert(chatMessages)
      .values({
        senderId: user.registrationId,
        receiverId,
        content: content.trim(),
      })
      .returning()

    return NextResponse.json({
      message: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        readAt: null,
        createdAt: message.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({error: 'Failed to send message'}, {status: 500})
  }
}
