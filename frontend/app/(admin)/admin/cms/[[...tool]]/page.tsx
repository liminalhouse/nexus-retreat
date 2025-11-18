/**
 * This route is responsible for the embedded Sanity Studio at /admin/cms
 */

'use client'

import {NextStudio} from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
