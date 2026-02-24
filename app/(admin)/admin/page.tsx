import Link from 'next/link'
import {PencilSquareIcon, DocumentTextIcon, EnvelopeIcon} from '@heroicons/react/24/outline'
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
              <PencilSquareIcon className="w-8 h-8 mr-3 text-nexus-coral" />
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
              <DocumentTextIcon className="w-8 h-8 mr-3 text-nexus-coral" />
              <h2 className="text-2xl font-bold">Registration Data</h2>
            </div>
            <p className="text-gray-600">View, edit, and export registration form submissions</p>
          </Link>

          {/* Email Registrants Card */}
          <Link
            href="/admin/registrations/email"
            className="block p-8 bg-white border-2 border-gray-200 rounded-lg hover:border-nexus-coral hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="w-8 h-8 mr-3 text-nexus-coral" />
              <h2 className="text-2xl font-bold">Email Registrants</h2>
            </div>
            <p className="text-gray-600">
              Compose and send emails to registered attendees
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
