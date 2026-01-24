import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAuth(redirectTo: string = '/admin') {
  const cookieStore = await cookies()
  const sanityToken = cookieStore.get('sanity-token')?.value

  if (!sanityToken) {
    redirect(`/admin/login?from=${encodeURIComponent(redirectTo)}`)
  }
}
