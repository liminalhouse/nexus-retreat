import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

/**
 * For use in API routes. Returns a 401 response if not authenticated, null if ok.
 * Unlike requireAuth(), this does not redirect — it returns a proper JSON error.
 */
export async function unauthorizedResponse(): Promise<NextResponse | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('sanity-token')?.value
  if (!token) return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  return null
}
