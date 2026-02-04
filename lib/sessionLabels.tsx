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
  StarIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import type {ComponentType, SVGProps} from 'react'

// Custom utensils icon (not available in Heroicons)
function UtensilsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" {...props}>
      <path
        fill={'currentColor'}
        d="M21 0c4.582 2.17 6.893 4.429 9 9 .424 3.282.38 6.534.34 9.84l.002 2.987a1480 1480 0 0 1-.049 9.755q-.009 3.386-.013 6.772c-.011 5.936-.04 11.873-.074 17.81-.03 6.059-.044 12.118-.06 18.178C30.114 86.228 30.062 98.114 30 110h30l-.063-9.176c-.067-10.007-.11-20.013-.144-30.02-.021-6.066-.05-12.133-.095-18.2q-.063-8.782-.078-17.564-.01-3.35-.043-6.7c-.029-3.13-.033-6.258-.031-9.387l-.044-2.797C59.538 10.601 60.264 7.393 64 3c5.223-4.056 10.653-3.774 17-3 4.582 2.17 6.893 4.429 9 9 .424 3.282.38 6.534.34 9.84l.002 2.987a1480 1480 0 0 1-.049 9.755q-.009 3.386-.013 6.772c-.011 5.936-.04 11.873-.074 17.81-.03 6.059-.044 12.118-.06 18.178C90.114 86.228 90.062 98.114 90 110h30l-.063-9.176c-.067-10.007-.11-20.013-.144-30.02-.021-6.066-.05-12.133-.095-18.2q-.063-8.782-.078-17.564-.01-3.35-.043-6.7c-.029-3.13-.033-6.258-.031-9.387l-.044-2.797c.036-5.555.762-8.763 4.498-13.156 5.223-4.056 10.653-3.774 17-3 4.599 2.178 6.8 4.468 9 9 .297 2.624.438 5.014.432 7.636l.031 2.278c.03 2.473.04 4.945.049 7.418q.026 2.579.054 5.158c.048 4.516.077 9.031.104 13.548.03 4.612.076 9.223.121 13.835.086 9.042.153 18.085.209 27.127l1.95-.948q4.454-2.16 8.913-4.31l3.066-1.491C180.619 71.697 196.986 66.61 214 63l2.244-.5C243.619 56.639 275.81 57.834 303 64l2.884.65C333.68 71.137 359.794 83.43 383 100l-.117-2.992C382.93 77.872 394.836 56.098 407 42l2.21-2.625C427.63 18.178 453.71 2.848 482 0c3.522-.2 7.035-.275 10.563-.312L495.35-.4c5.72-.054 9.226.398 13.65 4.4 3.169 4.169 3.428 7.82 3.383 12.888l.015 2.4c.013 2.664.005 5.328-.004 7.993q.007 2.887.019 5.776c.016 5.3.014 10.6.008 15.899-.002 5.712.012 11.425.025 17.138q.028 16.794.023 33.59a28436 28436 0 0 0 .017 35.165l.003 3.952q.02 26.498.016 52.995v2.094l-.005 16.835q-.008 32.808.042 65.618.056 36.864.05 73.73c-.002 13.011.003 26.022.028 39.034q.033 16.62.006 33.243c-.01 5.652-.01 11.304.01 16.956q.028 7.769-.008 15.538-.006 2.802.013 5.606c.11 16.226-2.718 28.063-14.223 40.222-10.53 9.941-22.482 11.898-36.277 11.668-12.338-.545-22.032-6.74-30.329-15.528-6.181-7.597-9.881-16.318-10.017-26.05l-.06-3.82-.051-4.114-.063-4.22q-.082-5.544-.153-11.087-.077-5.661-.161-11.322-.162-11.1-.307-22.199l-1.397 1.608C403.368 434.235 385.443 449.678 364 462l-2.341 1.351C341.775 474.665 320.395 482.391 298 487l-2.222.492C268.682 493.298 236.901 492.21 210 486l-2.558-.567C175.42 478.192 147.316 463.23 121 444l-.012 2.823q-.044 5.281-.14 10.562a393 393 0 0 0-.044 4.535c-.066 15.46-3.533 27.282-14.386 38.752-10.53 9.941-22.482 11.898-36.277 11.668-12.338-.545-22.032-6.74-30.329-15.528-5.563-6.837-9.97-15.489-9.909-24.4l.012-2.794.028-3.059.017-3.257q.02-3.54.045-7.081a6720 6720 0 0 0 .092-15.558l.01-2.054.036-6.327c.059-10.27.093-20.542.113-30.813l.004-2.253q.021-10.356.036-20.711l.025-14.203.005-2.383c.026-12.72.102-25.438.195-38.157q.141-19.61.119-39.22c-.007-8.055.03-16.107.126-24.161.07-6.188.058-12.373.019-18.561q-.007-3.791.067-7.581c.496-15.8.496-15.8-7.09-29.027-2.547-2.377-5.212-4.545-7.964-6.68C8.22 192.072 3.642 182.421 1 173l-.532-1.74c-.612-2.956-.604-5.754-.615-8.775l-.011-1.977q-.015-3.278-.019-6.554l-.02-4.702c-.02-5.144-.031-10.288-.041-15.432l-.013-5.315q-.029-12.483-.041-24.966-.015-14.408-.077-28.814-.044-11.139-.048-22.278c-.002-4.435-.011-8.869-.036-13.304q-.035-6.256-.018-12.513 0-2.295-.02-4.589a425 425 0 0 1 .003-6.272l-.007-3.543C.255 7.34 2.509 4.158 6.379 1.152 11.129-.936 15.922-.619 21 0m415.715 55.125c-28.862 30.564-25.927 72.304-26.745 111.511-.162 7.612-.393 15.21-.796 22.813-3.041 39.226-3.041 39.226 13.279 73.275 6.704 6.896 14.1 12.923 21.94 18.477 3.076 2.248 5.05 4.235 6.607 7.799.432 3.413.432 3.413.512 7.27l.054 2.063c.054 2.16.088 4.32.122 6.48q.05 2.204.103 4.412c.087 3.591.147 7.182.209 10.775h30V32c-16.414 0-34.039 11.996-45.285 23.125M150 124a57 57 0 0 0-.142 4.038l-.021 2.603-.013 2.843-.072 5.965c-.035 3.133-.064 6.266-.078 9.4-.115 22.278-4.338 36.734-19.83 53.23l-1.362 1.476C127 205 127 205 125.227 206.19c-3.639 2.724-5.055 4.894-5.902 9.408-.382 4.739-.353 9.481-.342 14.232q-.031 2.745-.071 5.492c-.062 4.963-.078 9.926-.083 14.89q-.01 4.658-.038 9.317-.097 16.276-.088 32.552c.004 10.09-.07 20.177-.18 30.267-.092 8.68-.13 17.36-.125 26.041a1054 1054 0 0 1-.092 15.528 600 600 0 0 0-.018 14.624 190 190 0 0 1-.051 5.338c-.203 9.045.269 15.4 6.673 22.207 2.909 2.8 5.943 5.388 9.09 7.914l2.556 2.2c1.847 1.581 3.737 3.045 5.694 4.488l2.13 1.592c40.473 29.753 89.506 42.71 139.386 35.571C310 453.75 334.816 444.645 357 430l1.787-1.175c8.564-5.701 16.224-12.1 23.6-19.263a473 473 0 0 1 4.894-4.652c11.96-11.415 21.693-24.583 29.687-39.048q.992-1.793 2.038-3.556c5.312-9.542 5.079-20.883 5.494-31.556l.142-3.643c.34-16.013-1.887-27.12-12.933-39.058-7.417-7.457-15.514-14.215-23.982-20.444-2.916-2.71-4.545-4.893-4.977-8.962-.09-3.063-.071-6.11-.024-9.175l.018-3.535q.021-3.798.06-7.595c.036-4.01.05-8.02.053-12.031.015-11.402.05-22.804.16-34.206.06-6.302.086-12.603.07-18.905-.005-3.33.013-6.658.064-9.989.055-3.72.049-7.436.028-11.157l.095-3.307c-.083-4.756-.356-7.627-3.437-11.373-2.521-2.294-5.09-4.355-7.837-6.37a1045 1045 0 0 1-4.035-3.266C341.036 107.422 308.662 94.21 275 91l-2.115-.203C234.557 87.37 178.698 95.302 150 124M30 140c-.702 22.346-.702 22.346 10.66 38.785q2.694 2.646 5.403 5.278 2.712 2.634 5.41 5.285l2.414 2.344c3.625 3.96 5.484 7.082 5.512 12.503l.038 3.106-.005 3.374.031 3.579q.036 4.843.043 9.686c.01 3.378.036 6.756.06 10.134.044 6.393.072 12.785.095 19.177.028 7.28.071 14.559.117 21.838.093 14.97.162 29.94.222 44.911h30l-.003-10.98c0-11.979.033-23.957.083-35.935.03-7.262.048-14.523.04-21.785q-.012-9.497.046-18.994.032-5.025.014-10.051c-.012-3.747.013-7.493.047-11.24l-.037-3.34c.119-7.324 1.727-11.397 6.81-16.675l2.378-2.541c.745-.71 1.49-1.42 2.259-2.15l2.498-2.424q2.565-2.46 5.14-4.906c7.152-6.961 9.281-10.872 10.725-20.979v-18zm30 210a29141 29141 0 0 0-.104 45.402q-.014 10.541-.047 21.082-.032 10.173-.039 20.347-.004 3.88-.021 7.761c-.015 3.624-.017 7.249-.016 10.873l-.022 3.24c.009 9.787.009 9.787 4.687 18.108 4.613 3.938 7.152 4.632 13.054 4.503 3.7-.466 5.766-1.842 8.508-4.316 3.504-4.712 4.126-9.284 4.12-15.043l.004-3.004-.01-3.26v-3.461c0-3.771-.009-7.543-.016-11.314l-.005-7.848q-.005-9.27-.021-18.54-.015-10.556-.022-21.112Q90.034 371.709 90 350zm392 0a29141 29141 0 0 0-.104 45.402q-.014 10.541-.047 21.082-.032 10.173-.039 20.347-.004 3.88-.021 7.761c-.015 3.624-.017 7.249-.016 10.873l-.022 3.24c.009 9.787.009 9.787 4.687 18.108 4.613 3.938 7.152 4.632 13.054 4.503 3.7-.466 5.766-1.842 8.508-4.316 3.504-4.712 4.126-9.284 4.12-15.043l.004-3.004-.01-3.26v-3.461c0-3.771-.009-7.543-.016-11.314l-.005-7.848q-.004-9.27-.021-18.54-.016-10.556-.022-21.112-.016-21.709-.05-43.418z"
      />
      <path
        fill={'currentColor'}
        d="m288 174 3.344 1.063c27.198 9.506 48.334 29.527 60.906 55.25 10.364 23.5 13.004 52.142 4.75 76.687l-1.062 3.344c-9.507 27.198-29.528 48.334-55.25 60.906-26.235 11.556-56.839 12.662-83.636 2.352-26.574-10.85-47.106-30.795-58.704-57.094-8.84-23.01-11.3-49.862-3.348-73.508l1.063-3.344c9.516-27.227 29.5-48.304 55.25-60.906 23.5-10.364 52.142-13.004 76.687-4.75m-86 49c-14.814 15.407-20.657 34.358-20.398 55.367.485 16.666 6.55 31.867 17.398 44.633l2.25 3c7.809 9.057 18.044 14.187 28.75 19l2.395 1.098c17.492 6.865 37.856 4.155 54.605-3.098 19.605-8.863 32.3-24.365 40-44l1.094-2.773c5.788-18.277 2.53-38.897-5.972-55.566-2.616-4.933-5.501-9.4-9.122-13.661l-2.25-3c-12.265-14.27-30.868-21.865-49.187-23.875-22.718-1.144-43.166 7.256-59.563 22.875"
      />
      <path
        fill={'currentColor'}
        d="M262 230c4.575 2.167 6.941 4.41 9 9 .362 3.612.282 7.187.188 10.813l-.042 2.966A650 650 0 0 1 271 260l2.195-.14c6.134-.23 10.077-.233 14.805 4.14 3.894 5.435 3.79 10.523 3 17-2.18 4.602-4.474 6.786-9 9-4.563.54-9.129.473-13.72.446-2.208-.008-4.414.02-6.622.052q-2.124.003-4.248-.002l-3.87.006c-5.114-.725-8.06-2.772-11.388-6.66-1.667-4.112-1.6-7.909-1.586-12.307l-.015-2.76q-.01-2.884.003-5.767c.008-2.932-.02-5.863-.052-8.795q-.003-2.808.002-5.615l-.034-2.643c.062-5.471.88-8.619 4.53-12.955 5.223-4.056 10.653-3.774 17-3"
      />
    </svg>
  )
}

export const sessionTypeLabels: Record<string, string> = {
  keynote: 'Keynote',
  panel: 'Panel',
  'lightning-talk': 'Lightning talk',
  social: 'Social',
  meal: 'Meal',
  activity: 'Activity',
}

export const sessionTagLabels: Record<string, string> = {
  geopolitics: 'Geopolitics',
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
  geopolitics: {
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

// Colors for session types - Tailwind classes (fallback when no tag)
export const sessionTypeColors: Record<
  string,
  {bg: string; text: string; border: string; imageBg: string}
> = {
  keynote: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    imageBg: 'bg-amber-300',
  },
  panel: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    imageBg: 'bg-blue-300',
  },
  'lightning-talk': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    imageBg: 'bg-yellow-300',
  },
  social: {
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    imageBg: 'bg-teal-100',
  },
  meal: {
    bg: 'bg-amber-50',
    text: 'text-yellow-600',
    border: 'border-amber-600',
    imageBg: 'bg-amber-100',
  },
  activity: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-200',
    imageBg: 'bg-slate-300',
  },
}

const defaultTypeColors = {
  bg: 'bg-gray-100',
  text: 'text-gray-800',
  border: 'border-gray-200',
  imageBg: 'bg-gray-200',
}

// Icons for session tags
export const sessionTagIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  geopolitics: GlobeAmericasIcon,
  'international-finance-economics': ChartBarIcon,
  'future-of-cities': BuildingOffice2Icon,
  'ai-tech': CpuChipIcon,
  'dinner-speakers': UserGroupIcon,
  'health-wellness': HeartIcon,
  'surprise-delight': SparklesIcon,
}

export const defaultTagIcon = CalendarDaysIcon

// Icons for session types (fallback when no tag is present)
export const sessionTypeIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  keynote: StarIcon,
  panel: UserGroupIcon,
  'lightning-talk': BoltIcon,
  social: ChatBubbleLeftRightIcon,
  meal: UtensilsIcon,
  activity: CalendarDaysIcon,
}

export const defaultTypeIcon = CalendarDaysIcon

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

export function getSessionTypeColors(value: string) {
  const cleanValue = stegaClean(value)
  return sessionTypeColors[cleanValue] || defaultTypeColors
}

export function getSessionTagIcon(value: string): ComponentType<SVGProps<SVGSVGElement>> {
  const cleanValue = stegaClean(value)
  return sessionTagIcons[cleanValue] || defaultTagIcon
}

export function getSessionTypeIcon(value: string): ComponentType<SVGProps<SVGSVGElement>> {
  const cleanValue = stegaClean(value)
  return sessionTypeIcons[cleanValue] || defaultTypeIcon
}
