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
import {ComponentType, SVGProps} from 'react'

type SessionPlaceholderProps = {
  tag?: string | null
  className?: string
  iconSize?: 'sm' | 'md' | 'lg'
}

const iconSizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-48 h-48',
}

// Color schemes matching sessionTagColors (hex values for SVG)
const tagColorSchemes: Record<string, {bg: string; fg: string}> = {
  'geopolitics': {bg: '#e0e7ff', fg: '#3730a3'}, // indigo
  'international-finance-economics': {bg: '#cffafe', fg: '#155e75'}, // cyan
  'future-of-cities': {bg: '#f3e8ff', fg: '#6b21a8'}, // purple
  'ai-tech': {bg: '#fce7f3', fg: '#9d174d'}, // pink
  'dinner-speakers': {bg: '#ffedd5', fg: '#9a3412'}, // orange
  'health-wellness': {bg: '#d1fae5', fg: '#065f46'}, // emerald
  'surprise-delight': {bg: '#fef3c7', fg: '#92400e'}, // amber
}

const defaultColors = {bg: '#f3f4f6', fg: '#374151'} // gray

const tagIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  'geopolitics': GlobeAmericasIcon,
  'international-finance-economics': ChartBarIcon,
  'future-of-cities': BuildingOffice2Icon,
  'ai-tech': CpuChipIcon,
  'dinner-speakers': UserGroupIcon,
  'health-wellness': HeartIcon,
  'surprise-delight': SparklesIcon,
}

function getColors(tag?: string | null) {
  if (!tag) return defaultColors
  const cleanTag = stegaClean(tag)
  return tagColorSchemes[cleanTag] || defaultColors
}

function getIcon(tag?: string | null) {
  if (!tag) return CalendarDaysIcon
  const cleanTag = stegaClean(tag)
  return tagIcons[cleanTag] || CalendarDaysIcon
}

export default function SessionPlaceholder({
  tag,
  className = '',
  iconSize = 'md',
}: SessionPlaceholderProps) {
  const colors = getColors(tag)
  const sizeClass = iconSizeClasses[iconSize]
  const Icon = getIcon(tag)

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{backgroundColor: colors.bg}}
    >
      <Icon className={sizeClass} style={{color: colors.fg}} />
    </div>
  )
}
