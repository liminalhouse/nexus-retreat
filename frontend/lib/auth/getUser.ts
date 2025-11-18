import { cookies } from 'next/headers'
import { getSanityUserInfo } from '@/lib/sanity/auth'

export async function getUser() {
  const cookieStore = await cookies()
  const sanityToken = cookieStore.get('sanity-token')

  if (!sanityToken?.value) {
    return null
  }

  const userInfo = await getSanityUserInfo(sanityToken.value)
  return userInfo
}
