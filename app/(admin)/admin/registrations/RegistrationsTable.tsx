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
import {getEditRegistrationUrl, getEditActivitiesUrl} from '@/lib/utils/editUrls'
import type {Registration} from '@/lib/types/registration'

const EMPTY_REGISTRATION: Registration = {
  id: '',
  created_at: '',
  updated_at: '',
  edit_token: '',
  email: '',
  first_name: '',
  last_name: '',
  mobile_phone: '',
  profile_picture: null,
  title: null,
  organization: null,
  address_line_1: '',
  address_line_2: null,
  city: '',
  state: '',
  zip: '',
  country: '',
  emergency_contact_name: '',
  emergency_contact_relation: null,
  emergency_contact_email: '',
  emergency_contact_phone: '',
  assistant_name: null,
  assistant_title: null,
  assistant_email: null,
  assistant_phone: null,
  guest_name: null,
  guest_relation: null,
  guest_email: null,
  dietary_restrictions: null,
  jacket_size: null,
  accommodations: null,
  dinner_attendance: null,
  activities: null,
  guest_dietary_restrictions: null,
  guest_jacket_size: null,
  guest_accommodations: null,
  guest_dinner_attendance: null,
  guest_activities: null,
  admin_notes: null,
}

type ColumnConfig = {
  key: string
  label: string
  render: (registration: Registration) => React.ReactNode
}

const COLUMN_WIDTHS = {
  avatar: 'minmax(65px, 1fr)',
  date: 'minmax(120px, 1fr)',
  name: 'minmax(150px, 1.5fr)',
  title: 'minmax(120px, 1fr)',
  organization: 'minmax(150px, 1.5fr)',
  email: 'minmax(200px, 2fr)',
  phone: 'minmax(150px, 1.2fr)',
  location: 'minmax(150px, 1.5fr)',
  emergency: 'minmax(180px, 1.5fr)',
  assistant: 'minmax(180px, 1.5fr)',
  guest: 'minmax(120px, 1fr)',
  dietary: 'minmax(150px, 1.5fr)',
  jacket: 'minmax(100px, 1fr)',
  accommodations: 'minmax(150px, 1.5fr)',
  dinners: 'minmax(120px, 1fr)',
  activities: 'minmax(200px, 1.5fr)',
  guest_dietary: 'minmax(100px, 1fr)',
  guest_jacket: 'minmax(120px, 1fr)',
  guest_accommodations: 'minmax(120px, 1fr)',
  guest_dinners: 'minmax(200px, 2fr)',
  guest_activities: 'minmax(200px, 1.5fr)',
  edit_registration_link: 'minmax(280px, 2fr)',
  edit_activities_link: 'minmax(280px, 2fr)',
  admin_notes: 'minmax(200px, 2fr)',
  actions: 'minmax(120px, 2fr)',
}

const GRID_TEMPLATE_COLUMNS = Object.values(COLUMN_WIDTHS).join(' ')

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
    render: (reg) => formatDate(reg.created_at),
  },
  {
    key: 'name',
    label: 'Name',
    render: (reg) => (
      <span className="font-medium text-gray-900">
        {reg.first_name} {reg.last_name}
      </span>
    ),
  },
  {
    key: 'title',
    label: 'Title',
    render: (reg) => reg.title || '-',
  },
  {
    key: 'organization',
    label: 'Organization',
    render: (reg) => reg.organization || '-',
  },
  {
    key: 'email',
    label: 'Email',
    render: (reg) => reg.email,
  },
  {
    key: 'phone',
    label: 'Phone',
    render: (reg) => <span className="whitespace-nowrap">{reg.mobile_phone || '-'}</span>,
  },
  {
    key: 'location',
    label: 'Location',
    render: (reg) => (reg.city && reg.state ? `${reg.city}, ${reg.state}` : '-'),
  },
  {
    key: 'emergency',
    label: 'Emergency Contact',
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
    render: (reg) => reg.guest_name || '-',
  },
  {
    key: 'dietary',
    label: 'Dietary',
    render: (reg) => <span className="truncate">{reg.dietary_restrictions || '-'}</span>,
  },
  {
    key: 'jacket',
    label: 'Jacket Size',
    render: (reg) => reg.jacket_size || '-',
  },
  {
    key: 'accommodations',
    label: 'Accommodations',
    render: (reg) => formatAccommodations(reg.accommodations),
  },
  {
    key: 'dinners',
    label: 'Dinners',
    render: (reg) => formatDinnerAttendance(reg.dinner_attendance),
  },
  {
    key: 'activities',
    label: 'Activities',
    render: (reg) => formatActivities(reg.activities),
  },
  {
    key: 'guest_dietary',
    label: 'Guest Dietary',
    render: (reg) => <span className="truncate">{reg.guest_dietary_restrictions || '-'}</span>,
  },
  {
    key: 'guest_jacket',
    label: 'Guest Jacket Size',
    render: (reg) => reg.guest_jacket_size || '-',
  },
  {
    key: 'guest_accommodations',
    label: 'Guest Accommodations',
    render: (reg) => formatAccommodations(reg.guest_accommodations),
  },
  {
    key: 'guest_dinners',
    label: 'Guest Dinners',
    render: (reg) => formatDinnerAttendance(reg.guest_dinner_attendance),
  },
  {
    key: 'guest_activities',
    label: 'Guest Activities',
    render: (reg) => formatActivities(reg.guest_activities),
  },
  {
    key: 'edit_registration_link',
    label: 'Edit Registration Link',
    render: (reg) => {
      const url = getEditRegistrationUrl(reg.edit_token)
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-nexus-coral hover:text-nexus-coral-light underline text-xs break-all"
        >
          {url}
        </a>
      )
    },
  },
  {
    key: 'edit_activities_link',
    label: 'Activities Form Link',
    render: (reg) => {
      const url = getEditActivitiesUrl(reg.edit_token)
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-nexus-coral hover:text-nexus-coral-light underline text-xs break-all"
        >
          {url}
        </a>
      )
    },
  },
  {
    key: 'admin_notes',
    label: 'Admin Notes (not visible to registrant)',
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
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [filters, setFilters] = useState<FilterCondition[]>([])

  const handleUpdateRegistration = (updatedRegistration: Registration) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === updatedRegistration.id ? updatedRegistration : reg)),
    )
  }

  const handleAddRegistration = (newRegistration: Registration) => {
    setRegistrations((prev) => [newRegistration, ...prev])
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
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search all fields..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
          />
        </div>
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
                  className="bg-blue-50 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-r border-gray-200"
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
                      className={`${column.key === 'admin_notes' ? 'bg-yellow-50' : 'bg-white'} group-hover:bg-zinc-50 px-3 py-4 text-sm text-gray-500 flex items-center border-b border-r border-gray-200 overflow-x-auto`}
                    >
                      {column.render(registration)}
                    </div>
                  ))}
                  <div
                    className="sticky right-0 bg-white group-hover:bg-slate-50 px-6 py-4 text-sm font-medium border-b border-l-2 border-gray-200 flex items-center"
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

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-4 bg-nexus-navy text-white rounded-lg hover:bg-nexus-navy-dark whitespace-nowrap text-md font-medium"
        >
          + Add Registrant
        </button>
      </div>

      {selectedRegistration && (
        <EditModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onSave={handleUpdateRegistration}
          isAdminView={true}
        />
      )}

      {showAddModal && (
        <EditModal
          registration={EMPTY_REGISTRATION}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddRegistration}
          isAdminView={true}
          mode="create"
        />
      )}
    </div>
  )
}
