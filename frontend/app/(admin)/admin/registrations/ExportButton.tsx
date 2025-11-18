'use client'

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

export default function ExportButton({ registrations }: { registrations: Registration[] }) {
  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) {
      alert('No data to export')
      return
    }

    // Get all unique keys from form_data
    const allKeys = new Set<string>()
    registrations.forEach((reg) => {
      Object.keys(reg.form_data || {}).forEach((key) => allKeys.add(key))
    })

    // Create CSV headers
    const headers = [
      'ID',
      'Created At',
      'Email',
      'First Name',
      'Last Name',
      'Phone',
      'Status',
      'Notes',
      ...Array.from(allKeys),
    ]

    // Create CSV rows
    const rows = registrations.map((reg) => {
      const row = [
        reg.id,
        new Date(reg.created_at).toLocaleString(),
        reg.email || '',
        reg.first_name || '',
        reg.last_name || '',
        reg.phone || '',
        reg.status || '',
        reg.notes || '',
      ]

      // Add form_data fields
      allKeys.forEach((key) => {
        const value = reg.form_data?.[key]
        row.push(
          value !== null && value !== undefined
            ? typeof value === 'object'
              ? JSON.stringify(value)
              : String(value)
            : ''
        )
      })

      return row
    })

    // Convert to CSV string
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
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
      className="px-4 py-2 bg-nexus-coral text-white rounded-lg hover:bg-nexus-coral-dark flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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
