import Link from 'next/link'
import {getSessionTypeLabel, getSessionTagLabel, getSessionTagColors} from '@/lib/sessionLabels'

type Size = 'sm' | 'md'

interface SessionTypeTagProps {
  type: string
  asLink?: boolean
  active?: boolean
  size?: Size
}

interface SessionTagProps {
  tag: string
  asLink?: boolean
  active?: boolean
  size?: Size
}

interface SessionTagsGroupProps {
  types?: string[] | null
  tags?: string[] | null
  asLinks?: boolean
  activeType?: string | null
  activeTag?: string | null
  size?: Size
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function SessionTypeTag({
  type,
  asLink = false,
  active = false,
  size = 'sm',
}: SessionTypeTagProps) {
  const label = getSessionTypeLabel(type)
  const baseClasses = `inline-block font-medium rounded-full bg-nexus-navy text-white ${sizeClasses[size]}`
  const activeClasses = active ? 'ring-2 ring-offset-1 ring-nexus-navy' : ''
  const hoverClasses = asLink ? 'hover:opacity-80 transition-all' : ''

  const className = `${baseClasses} ${activeClasses} ${hoverClasses}`

  if (asLink) {
    return (
      <Link href={`/schedule?type=${encodeURIComponent(type)}`} className={className}>
        {label}
      </Link>
    )
  }

  return <span className={className}>{label}</span>
}

export function SessionTag({tag, asLink = false, active = false, size = 'sm'}: SessionTagProps) {
  const label = getSessionTagLabel(tag)
  const colors = getSessionTagColors(tag)
  const baseClasses = `inline-block font-medium rounded-full border-1 ${colors.border}  ${colors.bg} ${colors.text} ${sizeClasses[size]}`
  const activeClasses = active ? 'ring-2 ring-offset-[-1] ring-current' : ''
  const hoverClasses = asLink ? 'hover:opacity-80 transition-all' : ''

  const className = `${baseClasses} ${activeClasses} ${hoverClasses}`

  if (asLink) {
    return (
      <Link href={`/schedule?tag=${encodeURIComponent(tag)}`} className={className}>
        {label}
      </Link>
    )
  }

  return <span className={className}>{label}</span>
}

export function SessionTagsGroup({
  types,
  tags,
  asLinks = false,
  activeType,
  activeTag,
  size = 'sm',
}: SessionTagsGroupProps) {
  const hasTypes = types && types.length > 0
  const hasTags = tags && tags.length > 0

  if (!hasTypes && !hasTags) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {types?.map((type) => (
        <SessionTypeTag
          key={type}
          type={type}
          asLink={asLinks}
          active={activeType === type}
          size={size}
        />
      ))}
      {tags?.map((tag) => (
        <SessionTag key={tag} tag={tag} asLink={asLinks} active={activeTag === tag} size={size} />
      ))}
    </div>
  )
}
