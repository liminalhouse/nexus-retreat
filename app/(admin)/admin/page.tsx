import Link from 'next/link'
import {requireAuth} from '@/lib/auth/requireAuth'

export default async function AdminDashboard() {
  await requireAuth('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sanity CMS Card */}
          <Link
            href="/admin/cms"
            className="block p-8 bg-white border-2 border-gray-200 rounded-lg hover:border-nexus-coral hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 mr-3 text-nexus-coral"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h2 className="text-2xl font-bold">Content Management</h2>
            </div>
            <p className="text-gray-600">
              Edit website content, pages, and settings in Sanity Studio
            </p>
          </Link>

          {/* Registrations Card */}
          <Link
            href="/admin/registrations"
            className="block p-8 bg-white border-2 border-gray-200 rounded-lg hover:border-nexus-coral hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 mr-3 text-nexus-coral"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-2xl font-bold">Registration Data</h2>
            </div>
            <p className="text-gray-600">View, edit, and export registration form submissions</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
