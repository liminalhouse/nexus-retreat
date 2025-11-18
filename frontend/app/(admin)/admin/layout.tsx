import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')

  if (!authToken || authToken.value !== 'authenticated') {
    redirect('/sign-in?from=/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/cms"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  CMS
                </Link>
                <Link
                  href="/admin/registrations"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrations
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            Admin Dashboard - Nexus Retreat
          </p>
        </div>
      </footer>
    </div>
  )
}
