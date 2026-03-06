import {redirect} from 'next/navigation'
import {getSessionUser} from '@/lib/auth/chatAuth'
import LoginForm from '@/app/components/LoginForm'

export default async function ChatLoginPage() {
  const user = await getSessionUser()
  if (user) redirect('/chat')

  return <LoginForm from="/chat" />
}
