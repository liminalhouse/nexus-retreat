import type React from 'react'

// Option configurations for form fields
export const ACCOMMODATION_OPTIONS = [
  {label: 'I will use my complimentary room the night of March 18', value: 'march_18'},
  {label: 'I will use my complimentary room the night of March 19', value: 'march_19'},
]

export const GUEST_ACCOMMODATION_OPTIONS = [
  {label: 'My guest will use a complimentary room the night of March 18', value: 'march_18'},
  {label: 'My guest will use a complimentary room the night of March 19', value: 'march_19'},
]

export const DINNER_OPTIONS = [
  {label: 'I will attend the Dinner on March 18', value: 'march_18'},
  {label: 'I will attend the Dinner on March 19', value: 'march_19'},
]

export const GUEST_DINNER_OPTIONS = [
  {label: 'My guest will attend the Dinner on March 18', value: 'march_18'},
  {label: 'My guest will attend the Dinner on March 19', value: 'march_19'},
]

export interface ActivityOption {
  label: string
  value: string
  description?: string
  chipDescription?: string
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    label: 'Golf - 9 holes',
    value: 'golf_9_march_18',
    description: 'March 18, 3-5pm',
    chipDescription: 'March 18',
  },
  {
    label: 'Golf - 9 holes',
    value: 'golf_9_march_19',
    description: 'March 19, 3-5pm',
    chipDescription: 'March 19',
  },
  {label: 'Golf - Full round', value: 'golf_full'},
  {
    label: 'Golf Challenge',
    value: 'golf_challenge',
    description:
      'March 19, 3-5pm: 3-hole Invictus challenge on the driving range with Prince Harry — cocktails, camaraderie, charity, and a competition!',
    chipDescription: 'March 19',
  },
  {label: 'Tennis', value: 'tennis', description: 'Court booking available'},
  {
    label: 'Pickleball',
    value: 'pickleball',
    description:
      'March 19, 3-5pm: Up the river / down the river tournament with drinks, laughs, and a winning duo to be crowned!',
  },
  {
    label: 'Sunrise Yoga',
    value: 'yoga_march_19',
    description: 'March 19, 6:30am',
    chipDescription: 'March 19',
  },
  {
    label: 'Sunrise Yoga',
    value: 'yoga_march_20',
    description: 'March 20, 6:30am',
    chipDescription: 'March 20',
  },
  {
    label: 'Bootcamp',
    value: 'bootcamp_march_19',
    description: 'March 19, 6:30am',
    chipDescription: 'March 19',
  },
  {
    label: 'Bootcamp',
    value: 'bootcamp_march_20',
    description: 'March 20, 6:30am',
    chipDescription: 'March 20',
  },
  {label: 'Spa', value: 'spa', description: 'Our team can assist with bookings'},
]

// Guest activity options are the same as attendee options
export const GUEST_ACTIVITY_OPTIONS = ACTIVITY_OPTIONS

// Label mappings derived from options
export const ACCOMMODATION_LABELS: Record<string, string> = {
  march_18: 'March 18',
  march_19: 'March 19',
}

export const DINNER_LABELS: Record<string, string> = {
  march_18: 'March 18',
  march_19: 'March 19',
}

// Derive ACTIVITY_LABELS from ACTIVITY_OPTIONS
export const ACTIVITY_LABELS: Record<string, string> = Object.fromEntries(
  ACTIVITY_OPTIONS.map((opt) => [
    opt.value,
    opt.description
      ? `${opt.label} ${opt.chipDescription ? `(${opt.chipDescription})` : ''}`
      : opt.label,
  ]),
)

const ACCOMMODATION_COLORS: Record<string, string> = {
  march_18: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  march_19: 'bg-blue-100 text-blue-800 border-blue-200',
}

const DINNER_COLORS: Record<string, string> = {
  march_18: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  march_19: 'bg-blue-100 text-blue-800 border-blue-200',
}

const ACTIVITY_COLORS: Record<string, string> = {
  golf_9_march_18: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  golf_9_march_19: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  golf_full: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  golf_challenge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  tennis: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  pickleball: 'bg-lime-100 text-lime-800 border-lime-200',
  yoga_march_19: 'bg-violet-100 text-violet-800 border-violet-200',
  yoga_march_20: 'bg-violet-100 text-violet-800 border-violet-200',
  bootcamp_march_19: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  bootcamp_march_20: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  spa: 'bg-pink-100 text-pink-800 border-pink-200',
}

// String formatters for CSV export
export function formatAccommodationsAsString(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return ''
  return values.map((v) => ACCOMMODATION_LABELS[v] || v).join(', ')
}

export function formatDinnerAttendanceAsString(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return ''
  return values.map((v) => DINNER_LABELS[v] || v).join(', ')
}

export function formatActivitiesAsString(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return ''
  return values.map((v) => ACTIVITY_LABELS[v] || v).join(', ')
}

// ReactNode formatters for display with colored chips
export function formatAccommodations(values: string[] | null | undefined): React.ReactNode {
  if (!values || values.length === 0) return '-'
  return (
    <ul className="flex flex-col gap-1">
      {values.map((v) => (
        <li
          key={v}
          className={`block px-2 py-0.5 text-xs rounded-full border-1 ${ACCOMMODATION_COLORS[v] || 'bg-gray-100 text-gray-800'}`}
        >
          {ACCOMMODATION_LABELS[v] || v}
        </li>
      ))}
    </ul>
  )
}

export function formatDinnerAttendance(values: string[] | null | undefined): React.ReactNode {
  if (!values || values.length === 0) return '-'
  return (
    <ul className="flex flex-col gap-1">
      {values.map((v) => (
        <li
          key={v}
          className={`block px-2 py-0.5 text-xs rounded-full border-1 ${DINNER_COLORS[v] || 'bg-gray-100 text-gray-800'}`}
        >
          {DINNER_LABELS[v] || v}
        </li>
      ))}
    </ul>
  )
}

export function formatActivities(values: string[] | null | undefined): React.ReactNode {
  if (!values || values.length === 0) return '-'
  return (
    <ul className="flex flex-col gap-1">
      {values
        .sort((a, b) => {
          const labelA = ACTIVITY_LABELS[a] || a
          const labelB = ACTIVITY_LABELS[b] || b
          return labelA.localeCompare(labelB)
        })
        .map((v) => (
          <li
            key={v}
            className={`block px-2 py-0.5 text-xs rounded-full border-1 ${ACTIVITY_COLORS[v] || 'bg-gray-100 text-gray-800'}`}
          >
            {ACTIVITY_LABELS[v] || v}
          </li>
        ))}
    </ul>
  )
}
