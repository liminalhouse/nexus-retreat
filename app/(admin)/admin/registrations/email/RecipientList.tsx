'use client'

import {useState, useMemo, useEffect, useRef} from 'react'
import Avatar from '@/app/components/Avatar'
import type {Registration} from '@/lib/db/schema'
import type {Registration as SnakeCaseRegistration} from '@/lib/types/registration'
import {ArrowUpRightIcon} from '@heroicons/react/24/outline'
import EditModal from '../EditModal'
import FilterBuilder, {evaluateFilter, FilterCondition} from '../FilterBuilder'

// Helper to convert camelCase registration to snake_case for EditModal
function toSnakeCase(reg: Registration): SnakeCaseRegistration {
  return {
    id: reg.id,
    created_at: reg.createdAt.toString(),
    updated_at: reg.updatedAt.toString(),
    edit_token: reg.editToken,
    email: reg.email,
    first_name: reg.firstName,
    last_name: reg.lastName,
    profile_picture: reg.profilePicture,
    title: reg.title,
    organization: reg.organization,
    mobile_phone: reg.mobilePhone,
    address_line_1: reg.addressLine1,
    address_line_2: reg.addressLine2,
    city: reg.city,
    state: reg.state,
    zip: reg.zip,
    country: reg.country,
    emergency_contact_name: reg.emergencyContactName,
    emergency_contact_relation: reg.emergencyContactRelation,
    emergency_contact_email: reg.emergencyContactEmail,
    emergency_contact_phone: reg.emergencyContactPhone,
    assistant_name: reg.assistantName,
    assistant_title: reg.assistantTitle,
    assistant_email: reg.assistantEmail,
    assistant_phone: reg.assistantPhone,
    guest_name: reg.guestName,
    guest_relation: reg.guestRelation,
    guest_email: reg.guestEmail,
    dietary_restrictions: reg.dietaryRestrictions,
    jacket_size: reg.jacketSize,
    accommodations: reg.accommodations,
    dinner_attendance: reg.dinnerAttendance,
    activities: reg.activities,
    guest_dietary_restrictions: reg.guestDietaryRestrictions,
    guest_jacket_size: reg.guestJacketSize,
    guest_accommodations: reg.guestAccommodations,
    guest_dinner_attendance: reg.guestDinnerAttendance,
    guest_activities: reg.guestActivities,
    admin_notes: reg.adminNotes,
    rsvp_guest_luncheon: reg.rsvpGuestLuncheon,
    hide_in_chat: reg.hideInChat,
    no_confirmation_email: reg.noConfirmationEmail,
    arrival: reg.arrival,
    departure: reg.departure,
    rooms: reg.rooms,
    hotel_full_name: reg.hotelFullName,
    confirmation_number: reg.confirmationNumber,
    room_guest: reg.roomGuest,
  }
}

export default function RecipientList({
  registrations,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onSetSelection,
  unsubscribedEmails = [],
}: {
  registrations: Registration[]
  selectedIds: Set<string>
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
  onSetSelection: (ids: Set<string>) => void
  unsubscribedEmails?: string[]
}) {
  const unsubscribedSet = useMemo(() => new Set(unsubscribedEmails), [unsubscribedEmails])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterCondition[]>([])
  const [viewingRegistration, setViewingRegistration] = useState<Registration | null>(null)

  const filteredRegistrations = useMemo(() => {
    let result = registrations

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.firstName.toLowerCase().includes(query) ||
          r.lastName.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query),
      )
    }

    const validFilters = filters.filter((f) => f.field && f.operator)
    if (validFilters.length > 0) {
      result = result.filter((r) => {
        const snaked = toSnakeCase(r)
        return validFilters.every((f) => evaluateFilter(snaked, f))
      })
    }

    return result
  }, [registrations, searchQuery, filters])

  const selectableRegistrations = useMemo(
    () => filteredRegistrations.filter((r) => !unsubscribedSet.has(r.email.toLowerCase())),
    [filteredRegistrations, unsubscribedSet],
  )

  const allFilteredSelected =
    selectableRegistrations.length > 0 &&
    selectableRegistrations.every((r) => selectedIds.has(r.id))

  // Track whether all filtered were selected before the filter/search changes.
  // Assigned during render so the effect reads the value from the current render cycle.
  const allFilteredSelectedRef = useRef(allFilteredSelected)
  allFilteredSelectedRef.current = allFilteredSelected

  useEffect(() => {
    if (allFilteredSelectedRef.current) {
      // All filtered were selected — keep selection in sync with the new filtered set
      onSetSelection(new Set(selectableRegistrations.map((r) => r.id)))
    }
  }, [filters, searchQuery])

  const handleSelectAllFiltered = (checked: boolean) => {
    if (checked) {
      onSetSelection(new Set(selectableRegistrations.map((r) => r.id)))
    } else {
      onSetSelection(new Set())
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recipients</h2>

        {/* Select All */}
        <div className="flex items-center gap-3 mb-1">
          <input
            type="checkbox"
            id="selectAll"
            checked={allFilteredSelected}
            onChange={(e) =>
              searchQuery.trim() || filters.length > 0
                ? handleSelectAllFiltered(e.target.checked)
                : onSelectAll(e.target.checked)
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="selectAll" className="text-sm text-gray-700">
            {searchQuery.trim() || filters.length > 0 ? 'Select All Filtered' : 'Select All'}
          </label>
          <span className="text-sm text-gray-500">
            ({selectedIds.size} of {registrations.length} selected)
          </span>
        </div>

        <div className="mb-3 ml-7">
          <button
            onClick={() => onSetSelection(new Set())}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Deselect All
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 mb-3"
        />

        {/* Filters */}
        <FilterBuilder filters={filters} onChange={setFilters} />
      </div>

      {/* Scrollable List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredRegistrations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery || filters.length > 0 ? 'No matching registrants found' : 'No registrants'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredRegistrations.map((registration) => {
              const isUnsubscribed = unsubscribedSet.has(registration.email.toLowerCase())
              return (
                <li
                  key={registration.id}
                  className={`flex items-center gap-3 p-3 ${
                    isUnsubscribed ? 'opacity-50 cursor-default' : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isUnsubscribed) {
                      onSelectOne(registration.id, !selectedIds.has(registration.id))
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(registration.id)}
                    disabled={isUnsubscribed}
                    onChange={(e) => {
                      e.stopPropagation()
                      if (!isUnsubscribed) {
                        onSelectOne(registration.id, e.target.checked)
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <Avatar
                    src={registration.profilePicture}
                    firstName={registration.firstName}
                    lastName={registration.lastName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {registration.firstName} {registration.lastName}
                      </p>
                      {isUnsubscribed && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600 shrink-0">
                          Unsubscribed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{registration.email}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setViewingRegistration(registration)
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View full info"
                  >
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Registration Details Modal */}
      {viewingRegistration && (
        <EditModal
          registration={toSnakeCase(viewingRegistration)}
          onClose={() => setViewingRegistration(null)}
          readOnly={true}
          isAdminView={true}
        />
      )}
    </div>
  )
}
