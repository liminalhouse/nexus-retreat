import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAuth(redirectTo: string = '/admin') {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')

  if (!authToken || authToken.value !== 'authenticated') {
    redirect(`/admin/login?from=${encodeURIComponent(redirectTo)}`)
  }

  return true
}
