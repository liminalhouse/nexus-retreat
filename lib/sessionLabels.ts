// Session type and tag label mappings
// Keep in sync with sanity/schemas/schemaTypes/documents/session.ts

import {stegaClean} from '@sanity/client/stega'
import {
  GlobeAmericasIcon,
  ChartBarIcon,
  BuildingOffice2Icon,
  CpuChipIcon,
  UserGroupIcon,
  HeartIcon,
  SparklesIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import type {ComponentType, SVGProps} from 'react'

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

// Colors for session tags - Tailwind classes
export const sessionTagColors: Record<
  string,
  {bg: string; text: string; border: string; imageBg: string}
> = {
  'geopolitics': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    imageBg: 'bg-indigo-300',
  },
  'international-finance-economics': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    imageBg: 'bg-cyan-300',
  },
  'future-of-cities': {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    imageBg: 'bg-purple-300',
  },
  'ai-tech': {
    bg: 'bg-pink-50',
    text: 'text-pink-800',
    border: 'border-pink-200',
    imageBg: 'bg-pink-300',
  },
  'dinner-speakers': {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    imageBg: 'bg-orange-300',
  },
  'health-wellness': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    imageBg: 'bg-emerald-300',
  },
  'surprise-delight': {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    imageBg: 'bg-rose-300',
  },
}

const defaultColors = {
  bg: 'bg-gray-100',
  text: 'text-gray-800',
  border: 'border-gray-200',
  imageBg: 'bg-gray-200',
}

// Icons for session tags
export const sessionTagIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  'geopolitics': GlobeAmericasIcon,
  'international-finance-economics': ChartBarIcon,
  'future-of-cities': BuildingOffice2Icon,
  'ai-tech': CpuChipIcon,
  'dinner-speakers': UserGroupIcon,
  'health-wellness': HeartIcon,
  'surprise-delight': SparklesIcon,
}

export const defaultTagIcon = CalendarDaysIcon

export function getSessionTypeLabel(value: string): string {
  const cleanValue = stegaClean(value)
  return sessionTypeLabels[cleanValue] || cleanValue
}

export function getSessionTagLabel(value: string): string {
  const cleanValue = stegaClean(value)
  return sessionTagLabels[cleanValue] || cleanValue
}

export function getSessionTagColors(value: string) {
  const cleanValue = stegaClean(value)
  return sessionTagColors[cleanValue] || defaultColors
}

export function getSessionTagIcon(value: string): ComponentType<SVGProps<SVGSVGElement>> {
  const cleanValue = stegaClean(value)
  return sessionTagIcons[cleanValue] || defaultTagIcon
}
