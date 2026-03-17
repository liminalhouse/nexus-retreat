import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {db} from '@/lib/db'
import {chatSessions} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('chat-token')?.value

    if (token) {
      await db.delete(chatSessions).where(eq(chatSessions.token, token))
      cookieStore.delete('chat-token')
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Chat logout error:', error)
    return NextResponse.json({error: 'Logout failed'}, {status: 500})
  }
}
