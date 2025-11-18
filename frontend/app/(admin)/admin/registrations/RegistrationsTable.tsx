'use client'

import { useState } from 'react'
import EditModal from './EditModal'

type Registration = {
  id: string
  created_at: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  form_data: any
  status?: string
  notes?: string
}

export default function RegistrationsTable({ registrations }: { registrations: Registration[] }) {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [filter, setFilter] = useState('')

  const filteredRegistrations = registrations.filter((reg) => {
    const searchStr = filter.toLowerCase()
    return (
      reg.email?.toLowerCase().includes(searchStr) ||
      reg.first_name?.toLowerCase().includes(searchStr) ||
      reg.last_name?.toLowerCase().includes(searchStr) ||
      reg.phone?.includes(searchStr)
    )
  })

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email, name, or phone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {registration.first_name} {registration.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        registration.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : registration.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {registration.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedRegistration(registration)}
                      className="text-nexus-coral hover:text-nexus-coral-dark"
                    >
                      View/Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRegistration && (
        <EditModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      )}
    </>
  )
}
