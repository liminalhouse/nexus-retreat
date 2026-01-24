import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from './token'

// Show drafts in development and staging (preview), published only in production
const isProduction = process.env.VERCEL_ENV === 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: isProduction, // Disable CDN in dev/staging to avoid cache issues with drafts
  perspective: isProduction ? 'published' : 'drafts',
  token, // Required if you have a private dataset
  stega: {
    studioUrl,
    // Set logger to 'console' for more verbose logging
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      // Exclude slug fields from stega encoding (they break URLs)
      if (props.sourcePath.at(-1) === 'current') {
        return false
      }

      return props.filterDefault(props)
    },
  },
})
