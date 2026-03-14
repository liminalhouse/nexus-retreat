export type SortKey = 'first_name_asc' | 'last_name_asc' | 'created_at_desc' | 'created_at_asc'

const SORT_OPTIONS: {value: SortKey; label: string}[] = [
  {value: 'first_name_asc', label: 'First Name (A-Z)'},
  {value: 'last_name_asc', label: 'Last Name (A-Z)'},
  {value: 'created_at_desc', label: 'Registration Date (Newest)'},
  {value: 'created_at_asc', label: 'Registration Date (Oldest)'},
]

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey
  onChange: (value: SortKey) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 whitespace-nowrap">Sort by</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="text-xs pl-2 pr-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent bg-white"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Generic sorter — works with both camelCase and snake_case registrations
// as long as you pass the right field accessors.
export function applySort<T>(
  items: T[],
  sortKey: SortKey,
  fields: {
    firstName: (r: T) => string
    lastName: (r: T) => string
    createdAt: (r: T) => string | Date
  },
): T[] {
  return [...items].sort((a, b) => {
    switch (sortKey) {
      case 'first_name_asc':
        return (
          fields.firstName(a).localeCompare(fields.firstName(b)) ||
          fields.lastName(a).localeCompare(fields.lastName(b))
        )
      case 'last_name_asc':
        return (
          fields.lastName(a).localeCompare(fields.lastName(b)) ||
          fields.firstName(a).localeCompare(fields.firstName(b))
        )
      case 'created_at_asc':
        return (
          new Date(fields.createdAt(a) as string).getTime() -
          new Date(fields.createdAt(b) as string).getTime()
        )
      case 'created_at_desc':
        return (
          new Date(fields.createdAt(b) as string).getTime() -
          new Date(fields.createdAt(a) as string).getTime()
        )
      default:
        return 0
    }
  })
}
