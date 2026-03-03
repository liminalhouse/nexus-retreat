import {redirect} from 'next/navigation'
import {getSessionUser} from '@/lib/auth/chatAuth'
import {ChatContainer} from '@/app/components/Chat'

export const metadata = {
  title: 'Chat',
}

export default async function ChatPage() {
  const user = await getSessionUser()
  if (!user) {
    redirect('/chat/login')
  }

  return (
    <div className="mx-auto md:px-4 md:py-6 bg-slate-100">
      <div className="mx-auto h-[calc(100vh-70px)] max-h-[800px] max-w-[1200px] mt-1">
        <ChatContainer />
      </div>
    </div>
  )
}
