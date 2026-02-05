'use client'

import {SanityImage} from 'sanity-image'
import {projectId, dataset} from '@/sanity/lib/api'

type SanityImageClientProps = {
  id: string
  alt: string
  width: number
  height: number
  mode?: 'cover' | 'contain'
  hotspot?: {x?: number; y?: number} | null
  crop?: {top?: number; bottom?: number; left?: number; right?: number} | null
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
  // Default to center if no hotspot or if x/y are undefined
  const resolvedHotspot = {
    x: hotspot?.x ?? 0.5,
    y: hotspot?.y ?? 0.5,
  }

  // Only pass crop if all values are defined
  const resolvedCrop =
    crop?.top !== undefined &&
    crop?.bottom !== undefined &&
    crop?.left !== undefined &&
    crop?.right !== undefined
      ? {top: crop.top, bottom: crop.bottom, left: crop.left, right: crop.right}
      : undefined

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
      crop={resolvedCrop}
      preview={preview ?? undefined}
      className={className}
    />
  )
}
