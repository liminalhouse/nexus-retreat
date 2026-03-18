import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get the authentication tokens from cookies
  const authToken = request.cookies.get('auth-token')
  const sanityToken = request.cookies.get('sanity-token')

  function withPathHeader() {
    return NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          'x-current-path': pathname,
        }),
      },
    })
  }

  // Check for prodMode query param to view published content in non-production
  const prodMode = request.nextUrl.searchParams.get('prodMode') === 'true'
  if (prodMode) {
    return NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          'x-sanity-perspective': 'published',
          'x-current-path': pathname,
        }),
      },
    })
  }

  // Redirect /edit-registration (exact) to /register/edit
  if (pathname === '/edit-registration') {
    return NextResponse.redirect(new URL('/register/edit', request.url))
  }

  // Allow access to admin login page without authentication
  if (pathname === '/admin/login') {
    return withPathHeader()
  }

  // Protect all other admin routes - require Sanity authentication (not just regular user auth)
  if (pathname.startsWith('/admin')) {
    if (!sanityToken?.value) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return withPathHeader()
  }

  // Check if the user is trying to access the sign-in page
  if (pathname === '/sign-in') {
    // If already authenticated, redirect to home
    if (authToken?.value === 'authenticated') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to sign-in page if not authenticated
    return withPathHeader()
  }

  // Check if the request is for API routes, static files, or Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to sign-in page with return URL
  if (!authToken || authToken.value !== 'authenticated') {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // User is authenticated, allow access
  return withPathHeader()
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
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
}
