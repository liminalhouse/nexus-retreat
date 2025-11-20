interface AvatarProps {
  src?: string | null
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Avatar({
  src,
  firstName,
  lastName,
  size = 'md',
  className = '',
}: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  if (src) {
    return (
      <div className={`overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}>
        <img src={src} alt={`${firstName} ${lastName}`} className={`object-cover w-full h-full`} />
      </div>
    )
  }

  // Fallback to initials with a nice gradient background
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  )
}
