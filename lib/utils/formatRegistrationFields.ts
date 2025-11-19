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

export const ACTIVITY_OPTIONS = [
  {label: 'Pickleball tournament (sunrise / downriver style) on March 19', value: 'pickleball'},
  {label: 'Golf - Full round', value: 'golf_full'},
  {label: 'Golf - 9 holes', value: 'golf_9'},
  {label: 'Golf - Drive, Chip, and Putt contest', value: 'golf_drive_chip_putt'},
  {label: 'Tennis', value: 'tennis'},
  {label: 'March 19 morning yoga', value: 'yoga_march_19'},
  {label: 'March 19 morning bootcamp', value: 'bootcamp_march_19'},
  {label: 'March 20 morning yoga', value: 'yoga_march_20'},
  {label: 'March 20 morning bootcamp', value: 'bootcamp_march_20'},
  {label: "Please don't bother me, I'll be at the spa :)", value: 'spa'},
]

export const GUEST_ACTIVITY_OPTIONS = [
  {label: 'Pickleball tournament (sunrise / downriver style) on March 19', value: 'pickleball'},
  {label: 'Golf - Full round', value: 'golf_full'},
  {label: 'Golf - 9 holes', value: 'golf_9'},
  {label: 'Golf - Drive, Chip, and Putt contest', value: 'golf_drive_chip_putt'},
  {label: 'Tennis', value: 'tennis'},
  {label: 'March 19 morning yoga', value: 'yoga_march_19'},
  {label: 'March 19 morning bootcamp', value: 'bootcamp_march_19'},
  {label: 'March 20 morning yoga', value: 'yoga_march_20'},
  {label: 'March 20 morning bootcamp', value: 'bootcamp_march_20'},
  {label: 'My guest will be at the spa :)', value: 'spa'},
]

// Label mappings derived from options
export const ACCOMMODATION_LABELS: Record<string, string> = {
  march_18: 'March 18',
  march_19: 'March 19',
}

export const DINNER_LABELS: Record<string, string> = {
  march_18: 'March 18',
  march_19: 'March 19',
}

export const ACTIVITY_LABELS: Record<string, string> = {
  pickleball: 'Pickleball',
  golf_full: 'Golf - Full round',
  golf_9: 'Golf - 9 holes',
  golf_drive_chip_putt: 'Golf - Drive, Chip, Putt',
  tennis: 'Tennis',
  yoga_march_19: 'Yoga (March 19)',
  bootcamp_march_19: 'Bootcamp (March 19)',
  yoga_march_20: 'Yoga (March 20)',
  bootcamp_march_20: 'Bootcamp (March 20)',
  spa: 'Spa',
}

export function formatAccommodations(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return '-'
  return values.map((v) => ACCOMMODATION_LABELS[v] || v).join(', ')
}

export function formatDinnerAttendance(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return '-'
  return values.map((v) => DINNER_LABELS[v] || v).join(', ')
}

export function formatActivities(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return '-'
  return values.map((v) => ACTIVITY_LABELS[v] || v).join(', ')
}
