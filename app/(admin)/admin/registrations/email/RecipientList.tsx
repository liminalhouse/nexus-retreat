'use client'

import {useState, useMemo} from 'react'
import Avatar from '@/app/components/Avatar'
import type {Registration} from '@/lib/db/schema'

export default function RecipientList({
  registrations,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: {
  registrations: Registration[]
  selectedIds: Set<string>
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) {
      return registrations
    }
    const query = searchQuery.toLowerCase()
    return registrations.filter(
      (r) =>
        r.firstName.toLowerCase().includes(query) ||
        r.lastName.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query),
    )
  }, [registrations, searchQuery])

  const allFilteredSelected =
    filteredRegistrations.length > 0 &&
    filteredRegistrations.every((r) => selectedIds.has(r.id))

  const handleSelectAllFiltered = (checked: boolean) => {
    if (checked) {
      // Add all filtered registrations to selection
      const newIds = new Set(selectedIds)
      filteredRegistrations.forEach((r) => newIds.add(r.id))
      // Need to update the parent state with these
      filteredRegistrations.forEach((r) => {
        if (!selectedIds.has(r.id)) {
          onSelectOne(r.id, true)
        }
      })
    } else {
      // Remove all filtered registrations from selection
      filteredRegistrations.forEach((r) => {
        if (selectedIds.has(r.id)) {
          onSelectOne(r.id, false)
        }
      })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recipients</h2>

        {/* Select All */}
        <div className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            id="selectAll"
            checked={allFilteredSelected}
            onChange={(e) =>
              searchQuery
                ? handleSelectAllFiltered(e.target.checked)
                : onSelectAll(e.target.checked)
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="selectAll" className="text-sm text-gray-700">
            Select All
          </label>
          <span className="text-sm text-gray-500">
            ({selectedIds.size} of {registrations.length} selected)
          </span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Scrollable List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredRegistrations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery ? 'No matching registrants found' : 'No registrants'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredRegistrations.map((registration) => (
              <li
                key={registration.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  onSelectOne(registration.id, !selectedIds.has(registration.id))
                }
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(registration.id)}
                  onChange={(e) => {
                    e.stopPropagation()
                    onSelectOne(registration.id, e.target.checked)
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Avatar
                  src={registration.profilePicture}
                  firstName={registration.firstName}
                  lastName={registration.lastName}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {registration.firstName} {registration.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {registration.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
