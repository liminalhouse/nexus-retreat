import {redirect} from 'next/navigation'
import {getChatUser} from '@/lib/auth/chatAuth'
import {ChatContainer} from '@/app/components/Chat'

export const metadata = {
  title: 'Chat',
}

export default async function ChatPage() {
  const user = await getChatUser()
  if (!user) {
    redirect('/chat/login')
  }

  return (
    <div className="mx-auto xl:px-4 xl:py-6 bg-slate-100">
      <div className="mx-auto h-[calc(100vh-70px)] max-h-[800px] max-w-[1200px]">
        <ChatContainer />
      </div>
    </div>
  )
}
