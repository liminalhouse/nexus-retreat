import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

/**
 * Client-side safe Sanity client for use in browser/client components
 * Does not include authentication token - only for public data
 */
export const browserClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for better performance on client-side
  perspective: 'published', // Only fetch published content on client-side
})
