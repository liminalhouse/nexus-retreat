import {redirect} from 'next/navigation'
import {getSessionUser} from '@/lib/auth/chatAuth'
import LoginForm from '@/app/components/LoginForm'

export default async function LoginPage() {
  const user = await getSessionUser()
  if (user) redirect('/profile')

  return <LoginForm />
}
