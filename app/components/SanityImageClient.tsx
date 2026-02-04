'use client'

import {SanityImage} from 'sanity-image'
import {projectId, dataset} from '@/sanity/lib/api'

type SanityImageClientProps = {
  id: string
  alt: string
  width: number
  height: number
  mode?: 'cover' | 'contain'
  hotspot?: {x: number; y: number} | null
  crop?: {top: number; bottom: number; left: number; right: number} | null
  preview?: string | null
  className?: string
}

export default function SanityImageClient({
  id,
  alt,
  width,
  height,
  mode = 'cover',
  hotspot,
  crop,
  preview,
  className,
}: SanityImageClientProps) {
  // Default to center if no hotspot is defined
  const resolvedHotspot = hotspot ?? {x: 0.5, y: 0.5}

  return (
    <SanityImage
      id={id}
      projectId={projectId}
      dataset={dataset}
      alt={alt}
      width={width}
      height={height}
      mode={mode}
      hotspot={resolvedHotspot}
      crop={crop ?? undefined}
      preview={preview ?? undefined}
      className={className}
    />
  )
}
