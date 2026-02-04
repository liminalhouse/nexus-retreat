import {
  getSessionTagColors,
  getSessionTagIcon,
  getSessionTypeColors,
  getSessionTypeIcon,
  defaultTagIcon,
} from '@/lib/sessionLabels'

type SessionPlaceholderProps = {
  tag?: string | null
  sessionType?: string | null
  className?: string
  iconSize?: 'sm' | 'md' | 'lg'
}

const iconSizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-48 h-48',
}

const defaultColors = {
  imageBg: 'bg-gray-200',
  text: 'text-gray-800',
}

export default function SessionPlaceholder({
  tag,
  sessionType,
  className = '',
  iconSize = 'md',
}: SessionPlaceholderProps) {
  // Use tag colors if tag exists, fall back to session type colors, then default
  const colors = tag
    ? getSessionTagColors(tag)
    : sessionType
      ? getSessionTypeColors(sessionType)
      : defaultColors

  const sizeClass = iconSizeClasses[iconSize]

  // Use tag icon if tag exists, fall back to session type icon, then default
  const Icon = tag
    ? getSessionTagIcon(tag)
    : sessionType
      ? getSessionTypeIcon(sessionType)
      : defaultTagIcon

  return (
    <div className={`flex items-center justify-center ${colors.imageBg} ${className}`}>
      <Icon className={`${sizeClass} ${colors.text}`} />
    </div>
  )
}
