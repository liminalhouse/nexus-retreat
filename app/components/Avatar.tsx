import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const randomizedGradients = [
  'from-blue-500 to-purple-600',
  'from-green-400 to-blue-500',
  'from-pink-500 to-purple-500',
  'from-yellow-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-indigo-400 to-purple-500',
]

const defaultGradient = 'from-gray-400 to-gray-600'

const getGradientFromName = (name: string) => {
  if (!name) return defaultGradient // Default gradient if name is empty
  const hash = name.length + name.charCodeAt(0) + name.charCodeAt(name.length - 1) + 1
  return randomizedGradients[hash % randomizedGradients.length]
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

  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  if (src) {
    const pixelSize = sizePixels[size]
    return (
      <div
        className={`relative overflow-hidden rounded-full flex-shrink-0 ${sizeClasses[size]} ${className} bg-white border-1 border-gray-200`}
      >
        <Image
          src={src}
          alt={`${firstName} ${lastName}`}
          width={pixelSize}
          height={pixelSize}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // Fallback to initials with a nice gradient background
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${getGradientFromName(firstName)} flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  )
}
