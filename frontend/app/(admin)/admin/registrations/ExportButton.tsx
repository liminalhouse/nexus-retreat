'use client'

import {
  formatAccommodations,
  formatDinnerAttendance,
  formatActivities,
} from '@/lib/utils/formatRegistrationFields'

type Registration = {
  id: string
  created_at: string
  email: string
  first_name?: string
  last_name?: string
  title?: string | null
  organization?: string | null
  mobile_phone?: string
  address_line_1?: string
  address_line_2?: string | null
  city?: string
  state?: string
  zip?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_relation?: string | null
  emergency_contact_email?: string
  emergency_contact_phone?: string
  assistant_name?: string | null
  assistant_title?: string | null
  assistant_email?: string | null
  assistant_phone?: string | null
  guest_name?: string | null
  guest_relation?: string | null
  guest_email?: string | null
  dietary_restrictions?: string | null
  jacket_size?: string | null
  accommodations?: string[] | null
  dinner_attendance?: string[] | null
  activities?: string[] | null
  guest_dietary_restrictions?: string | null
  guest_jacket_size?: string | null
  guest_accommodations?: string[] | null
  guest_dinner_attendance?: string[] | null
  guest_activities?: string[] | null
}

export default function ExportButton({registrations}: {registrations: Registration[]}) {
  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) {
      alert('No data to export')
      return
    }

    // Create CSV headers with all fields
    const headers = [
      'Registration Date',
      'Email',
      'First Name',
      'Last Name',
      'Title',
      'Organization',
      'Mobile Phone',
      'Address Line 1',
      'Address Line 2',
      'City',
      'State',
      'Zip',
      'Country',
      'Emergency Contact Name',
      'Emergency Contact Relation',
      'Emergency Contact Email',
      'Emergency Contact Phone',
      'Assistant Name',
      'Assistant Title',
      'Assistant Email',
      'Assistant Phone',
      'Guest Name',
      'Guest Relation',
      'Guest Email',
      'Dietary Restrictions',
      'Jacket Size',
      'Accommodations',
      'Dinner Attendance',
      'Activities',
      'Guest Dietary Restrictions',
      'Guest Jacket Size',
      'Guest Accommodations',
      'Guest Dinner Attendance',
      'Guest Activities',
    ]

    // Create CSV rows
    const rows = registrations.map((reg) => {
      return [
        new Date(reg.created_at).toLocaleString(),
        reg.email || '',
        reg.first_name || '',
        reg.last_name || '',
        reg.title || '',
        reg.organization || '',
        reg.mobile_phone || '',
        reg.address_line_1 || '',
        reg.address_line_2 || '',
        reg.city || '',
        reg.state || '',
        reg.zip || '',
        reg.country || '',
        reg.emergency_contact_name || '',
        reg.emergency_contact_relation || '',
        reg.emergency_contact_email || '',
        reg.emergency_contact_phone || '',
        reg.assistant_name || '',
        reg.assistant_title || '',
        reg.assistant_email || '',
        reg.assistant_phone || '',
        reg.guest_name || '',
        reg.guest_relation || '',
        reg.guest_email || '',
        reg.dietary_restrictions || '',
        reg.jacket_size || '',
        formatAccommodations(reg.accommodations),
        formatDinnerAttendance(reg.dinner_attendance),
        formatActivities(reg.activities),
        reg.guest_dietary_restrictions || '',
        reg.guest_jacket_size || '',
        formatAccommodations(reg.guest_accommodations),
        formatDinnerAttendance(reg.guest_dinner_attendance),
        formatActivities(reg.guest_activities),
      ]
    })

    // Convert to CSV string
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    // Download file
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={exportToCSV}
      className="px-4 py-2 bg-nexus-navy hover:bg-nexus-navy-dark text-white rounded-lg hover:bg-nexus-coral-dark flex items-center gap-2 cursor-pointer"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export to CSV
    </button>
  )
}
