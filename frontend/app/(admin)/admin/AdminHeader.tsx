import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function AdminHeader() {
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
              <LogoutButton />
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
    </div>
  )
}
