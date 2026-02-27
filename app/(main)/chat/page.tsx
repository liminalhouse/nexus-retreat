import {ChatContainer} from '@/app/components/Chat'

export const metadata = {
  title: 'Chat',
}

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-70px)]">
      <ChatContainer />
    </div>
  )
}
