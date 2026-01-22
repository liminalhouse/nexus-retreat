/**
 * This route is responsible for the embedded Sanity Studio at /admin/cms
 */

'use client'

import dynamic from 'next/dynamic'

const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
})

import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
