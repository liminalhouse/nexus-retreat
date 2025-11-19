import { cookies } from 'next/headers'
import { getSanityUserInfo } from '@/lib/sanity/auth'

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sanity-token')?.value

  if (!token) return null

  return await getSanityUserInfo(token)
}
