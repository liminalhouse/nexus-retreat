import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function proxy(request: NextRequest) {
  // Get the authentication tokens from cookies
  const authToken = request.cookies.get('auth-token')
  const sanityToken = request.cookies.get('sanity-token')

  // Check for prodMode query param to view published content in non-production
  const prodMode = request.nextUrl.searchParams.get('prodMode') === 'true'
  if (prodMode) {
    const response = NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          'x-sanity-perspective': 'published',
        }),
      },
    })
    return response
  }

  // Allow access to admin login page without authentication
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect all other admin routes - require Sanity authentication (not just regular user auth)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sanityToken?.value) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Protect /schedule and routes - require Sanity authentication (admin only)
  if (process.env.VERCEL_ENV === 'production' && request.nextUrl.pathname.startsWith('/schedule')) {
    if (!sanityToken?.value) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Check if the user is trying to access the sign-in page
  if (request.nextUrl.pathname === '/sign-in') {
    // If already authenticated, redirect to home
    if (authToken?.value === 'authenticated') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to sign-in page if not authenticated
    return NextResponse.next()
  }

  // Check if the request is for API routes, static files, or Next.js internals
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/icons/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to sign-in page with return URL
  if (!authToken || authToken.value !== 'authenticated') {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // User is authenticated, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
