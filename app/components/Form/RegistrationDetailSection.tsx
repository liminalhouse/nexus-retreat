import type React from 'react'

export interface DetailEntry {
  label: string
  value?: string | null
  items?: string[]
  formatItem?: (item: string) => string
}

export default function RegistrationDetailSection({
  title,
  entries,
  children,
}: {
  title: string
  entries?: DetailEntry[]
  children?: React.ReactNode
}) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        {entries?.map((entry) => {
          if (entry.items !== undefined) {
            return (
              <div key={entry.label}>
                <span className="text-sm text-gray-600 block mb-1">{entry.label}:</span>
                {entry.items && entry.items.length > 0 ? (
                  <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                    {entry.items.map((item, idx) => (
                      <li key={idx}>{entry.formatItem ? entry.formatItem(item) : item}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm font-medium text-gray-900">-</span>
                )}
              </div>
            )
          }
          return (
            <div key={entry.label} className="flex justify-between">
              <span className="text-sm text-gray-600">{entry.label}:</span>
              <span className="text-sm font-medium text-gray-900">{entry.value || '-'}</span>
            </div>
          )
        })}
        {children}
      </div>
    </div>
  )
}
