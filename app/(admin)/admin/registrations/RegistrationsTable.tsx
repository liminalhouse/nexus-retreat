'use client'

import {useState} from 'react'
import EditModal from './EditModal'
import Avatar from '@/app/components/Avatar'
import FilterBuilder, {type FilterCondition, evaluateFilter} from './FilterBuilder'
import {
  formatAccommodations,
  formatDinnerAttendance,
  formatActivities,
} from '@/lib/utils/formatRegistrationFields'
import type {Registration} from '@/lib/types/registration'

type ColumnConfig = {
  key: string
  label: string
  width: string
  render: (registration: Registration) => React.ReactNode
}

const GRID_TEMPLATE_COLUMNS =
  'minmax(65px, 1fr) minmax(120px, 1fr) minmax(150px, 1.5fr) minmax(120px, 1fr) minmax(150px, 1.5fr) minmax(200px, 2fr) minmax(150px, 1.2fr) minmax(150px, 1.5fr) minmax(180px, 1.5fr) minmax(150px, 1.5fr) minmax(120px, 1fr) minmax(150px, 1.5fr) minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(120px, 1fr) minmax(150px, 1.5fr) minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(120px, 1fr) minmax(200px, 2fr) minmax(120px, 1fr)'

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const columns: ColumnConfig[] = [
  {
    key: 'avatar',
    label: '',
    width: 'minmax(60px, 60px)',
    render: (reg) => (
      <Avatar
        src={reg.profile_picture}
        firstName={reg.first_name}
        lastName={reg.last_name}
        size="md"
      />
    ),
  },
  {
    key: 'date',
    label: 'Date',
    width: 'minmax(120px, 1fr)',
    render: (reg) => formatDate(reg.created_at),
  },
  {
    key: 'name',
    label: 'Name',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => (
      <span className="font-medium text-gray-900">
        {reg.first_name} {reg.last_name}
      </span>
    ),
  },
  {
    key: 'title',
    label: 'Title',
    width: 'minmax(120px, 1fr)',
    render: (reg) => reg.title || '-',
  },
  {
    key: 'organization',
    label: 'Organization',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => reg.organization || '-',
  },
  {
    key: 'email',
    label: 'Email',
    width: 'minmax(200px, 2fr)',
    render: (reg) => reg.email,
  },
  {
    key: 'phone',
    label: 'Phone',
    width: 'minmax(150px, 1.2fr)',
    render: (reg) => <span className="whitespace-nowrap">{reg.mobile_phone || '-'}</span>,
  },
  {
    key: 'location',
    label: 'Location',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => (reg.city && reg.state ? `${reg.city}, ${reg.state}` : '-'),
  },
  {
    key: 'emergency',
    label: 'Emergency Contact',
    width: 'minmax(180px, 1.5fr)',
    render: (reg) =>
      reg.emergency_contact_name ? (
        <div className="flex flex-col">
          <span className="font-medium">{reg.emergency_contact_name}</span>
          <span className="text-xs text-gray-400">{reg.emergency_contact_phone}</span>
        </div>
      ) : (
        '-'
      ),
  },
  {
    key: 'assistant',
    label: 'Assistant',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) =>
      reg.assistant_name ? (
        <div className="flex flex-col">
          <span className="font-medium">{reg.assistant_name}</span>
          <span className="text-xs text-gray-400">{reg.assistant_email}</span>
        </div>
      ) : (
        '-'
      ),
  },
  {
    key: 'guest',
    label: 'Guest',
    width: 'minmax(120px, 1fr)',
    render: (reg) => reg.guest_name || '-',
  },
  {
    key: 'dietary',
    label: 'Dietary',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => <span className="truncate">{reg.dietary_restrictions || '-'}</span>,
  },
  {
    key: 'jacket',
    label: 'Jacket Size',
    width: 'minmax(100px, 1fr)',
    render: (reg) => reg.jacket_size || '-',
  },
  {
    key: 'accommodations',
    label: 'Accommodations',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => formatAccommodations(reg.accommodations),
  },
  {
    key: 'dinners',
    label: 'Dinners',
    width: 'minmax(120px, 1fr)',
    render: (reg) => formatDinnerAttendance(reg.dinner_attendance),
  },
  // TODO: Hide activities for now
  // {
  //   key: 'activities',
  //   label: 'Activities',
  //   width: 'minmax(180px, 1.5fr)',
  //   render: (reg) => formatActivities(reg.activities),
  // },
  {
    key: 'guest_dietary',
    label: 'Guest Dietary',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => <span className="truncate">{reg.guest_dietary_restrictions || '-'}</span>,
  },
  {
    key: 'guest_jacket',
    label: 'Guest Jacket Size',
    width: 'minmax(100px, 1fr)',
    render: (reg) => reg.guest_jacket_size || '-',
  },
  {
    key: 'guest_accommodations',
    label: 'Guest Accommodations',
    width: 'minmax(150px, 1.5fr)',
    render: (reg) => formatAccommodations(reg.guest_accommodations),
  },
  {
    key: 'guest_dinners',
    label: 'Guest Dinners',
    width: 'minmax(120px, 1fr)',
    render: (reg) => formatDinnerAttendance(reg.guest_dinner_attendance),
  },
  // TODO: Hide guest activities for now
  // {
  //   key: 'guest_activities',
  //   label: 'Guest Activities',
  //   width: 'minmax(180px, 1.5fr)',
  //   render: (reg) => formatActivities(reg.guest_activities),
  // },
  {
    key: 'admin_notes',
    label: 'Admin Notes (not visible to registrant)',
    width: 'minmax(200px, 2fr)',
    render: (reg) => <span className="text-xs">{reg.admin_notes || '-'}</span>,
  },
]

export default function RegistrationsTable({
  registrations: initialRegistrations,
}: {
  registrations: Registration[]
}) {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [filters, setFilters] = useState<FilterCondition[]>([])

  const handleUpdateRegistration = (updatedRegistration: Registration) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === updatedRegistration.id ? updatedRegistration : reg)),
    )
  }

  const filteredRegistrations = registrations.filter((reg) => {
    // Search filter - search across all text fields
    const searchStr = searchFilter.toLowerCase()
    const matchesSearch =
      !searchFilter ||
      Object.entries(reg).some(([key, value]) => {
        // Skip non-searchable fields
        if (
          key === 'id' ||
          key === 'created_at' ||
          key === 'updated_at' ||
          key === 'edit_token' ||
          key === 'profile_picture' ||
          value === null ||
          value === undefined
        ) {
          return false
        }

        // Handle array fields (accommodations, dinner_attendance, etc.)
        if (Array.isArray(value)) {
          return value.some((item) => String(item).toLowerCase().includes(searchStr))
        }

        // Handle all other fields as strings
        return String(value).toLowerCase().includes(searchStr)
      })

    // Apply all dynamic filters
    const matchesAllFilters = filters.every((filter) => evaluateFilter(reg, filter))

    return matchesSearch && matchesAllFilters
  })

  return (
    <div className="mt-2 sm:mx-auto lg:mx-4 mb-20">
      <div className="mb-4 space-y-4">
        <input
          type="text"
          placeholder="Search all fields..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
        />
        <FilterBuilder filters={filters} onChange={setFilters} />
      </div>
      <div className="bg-white rounded-sm shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid" style={{gridTemplateColumns: GRID_TEMPLATE_COLUMNS}}>
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200"
                >
                  {column.label}
                </div>
              ))}
              <div
                className="sticky right-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-l-2 border-gray-200"
                style={{boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)'}}
              >
                Actions
              </div>
            </div>

            {/* Body Rows */}
            <div>
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="grid group"
                  style={{gridTemplateColumns: GRID_TEMPLATE_COLUMNS}}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`${column.key === 'admin_notes' ? 'bg-yellow-50' : 'bg-white'} group-hover:bg-blue-50 px-3 py-4 text-sm text-gray-500 flex items-center border-b border-r border-gray-200 overflow-x-auto`}
                    >
                      {column.render(registration)}
                    </div>
                  ))}
                  <div
                    className="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium border-b border-l-2 border-gray-200 flex items-center"
                    style={{boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)'}}
                  >
                    <button
                      onClick={() => setSelectedRegistration(registration)}
                      className="text-nexus-coral hover:text-nexus-coral-light font-semibold"
                    >
                      View/Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedRegistration && (
        <EditModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onSave={handleUpdateRegistration}
          isAdminView={true}
        />
      )}
    </div>
  )
}
