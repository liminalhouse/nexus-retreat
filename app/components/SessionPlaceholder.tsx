import {getSessionTagColors, getSessionTagIcon, defaultTagIcon} from '@/lib/sessionLabels'

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

export default function SessionPlaceholder({
  tag,
  className = '',
  iconSize = 'md',
}: SessionPlaceholderProps) {
  const colors = tag ? getSessionTagColors(tag) : {imageBg: 'bg-gray-200', text: 'text-gray-800'}
  const sizeClass = iconSizeClasses[iconSize]
  const Icon = tag ? getSessionTagIcon(tag) : defaultTagIcon

  return (
    <div className={`flex items-center justify-center ${colors.imageBg} ${className}`}>
      <Icon className={`${sizeClass} ${colors.text}`} />
    </div>
  )
}
