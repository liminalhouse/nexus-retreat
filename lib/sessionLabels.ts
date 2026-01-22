// Session type and tag label mappings
// Keep in sync with sanity/schemas/schemaTypes/documents/session.ts

export const sessionTypeLabels: Record<string, string> = {
  'keynote': 'Keynote',
  'panel': 'Panel',
  'lightning-talk': 'Lightning talk',
  'social': 'Social',
  'meal': 'Meal',
  'activity': 'Activity',
}

export const sessionTagLabels: Record<string, string> = {
  'geopolitics': 'Geopolitics',
  'international-finance-economics': 'International Finance & Economics',
  'future-of-cities': 'Future of Cities',
  'ai-tech': 'AI & Tech',
  'dinner-speakers': 'Dinner Speakers',
  'health-wellness': 'Health & Wellness',
  'surprise-delight': 'Surprise & Delight',
}

// Pastel colors for session tags (bg and text colors for contrast)
export const sessionTagColors: Record<string, {bg: string; text: string}> = {
  'geopolitics': {bg: 'bg-indigo-100', text: 'text-indigo-800'},
  'international-finance-economics': {bg: 'bg-cyan-100', text: 'text-cyan-800'},
  'future-of-cities': {bg: 'bg-purple-100', text: 'text-purple-800'},
  'ai-tech': {bg: 'bg-pink-100', text: 'text-pink-800'},
  'dinner-speakers': {bg: 'bg-orange-100', text: 'text-orange-800'},
  'health-wellness': {bg: 'bg-emerald-100', text: 'text-emerald-800'},
  'surprise-delight': {bg: 'bg-amber-100', text: 'text-amber-800'},
}

export function getSessionTypeLabel(value: string): string {
  return sessionTypeLabels[value] || value
}

export function getSessionTagLabel(value: string): string {
  return sessionTagLabels[value] || value
}

export function getSessionTagColors(value: string): {bg: string; text: string} {
  return sessionTagColors[value] || {bg: 'bg-gray-100', text: 'text-gray-800'}
}
