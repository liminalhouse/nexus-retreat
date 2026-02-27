import {NextResponse} from 'next/server'
import {requireChatAuth} from '@/lib/auth/chatAuth'

export async function GET() {
  const user = await requireChatAuth()
  if (!user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  return NextResponse.json({user})
}
