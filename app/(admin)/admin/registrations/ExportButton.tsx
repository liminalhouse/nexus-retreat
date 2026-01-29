'use client'

import {
  formatAccommodationsAsString,
  formatDinnerAttendanceAsString,
  formatActivitiesAsString,
} from '@/lib/utils/formatRegistrationFields'
import {getEditRegistrationUrl, getEditActivitiesUrl} from '@/lib/utils/editUrls'
import {getFieldMetadata} from '@/lib/utils/registrationFields'
import type {Registration} from '@/lib/types/registration'

export default function ExportButton({registrations}: {registrations: Registration[]}) {
  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) {
      alert('No data to export')
      return
    }

    // Get field metadata from form config
    const fieldMetadata = getFieldMetadata()

    // Create CSV headers dynamically from form config
    const headers = [
      'Registration Date',
      ...fieldMetadata.map((field) => field.label),
      'Edit Registration Link',
      'Activities Form Link',
    ]

    // Helper to format field value
    const formatValue = (fieldName: string, value: any): string => {
      if (value === null || value === undefined) return ''

      // Handle array fields (accommodations, dinners, activities)
      if (Array.isArray(value)) {
        if (fieldName.includes('accommodations')) return formatAccommodationsAsString(value)
        if (fieldName.includes('dinner')) return formatDinnerAttendanceAsString(value)
        if (fieldName.includes('activities')) return formatActivitiesAsString(value)
        return value.join(', ')
      }

      return String(value)
    }

    // Create CSV rows dynamically from field metadata
    const rows = registrations.map((reg) => {
      const row: string[] = [new Date(reg.created_at).toLocaleString()]

      // Add each field value in the order defined by field metadata
      fieldMetadata.forEach((field) => {
        const value = (reg as any)[field.name]
        row.push(formatValue(field.name, value))
      })

      // Add edit links
      row.push(getEditRegistrationUrl(reg.edit_token))
      row.push(getEditActivitiesUrl(reg.edit_token))

      return row
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
