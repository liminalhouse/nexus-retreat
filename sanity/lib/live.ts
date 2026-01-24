import {defineLive} from 'next-sanity/live'
import {headers} from 'next/headers'
import {client} from './client'
import {token} from './token'

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

// In non-production environments (staging/preview), default to drafts perspective
const isProduction = process.env.VERCEL_ENV === 'production'
const liveClient = client.withConfig({
  perspective: isProduction ? 'published' : 'drafts',
  useCdn: isProduction, // CDN must be disabled for drafts perspective
})

export const {sanityFetch: baseSanityFetch, SanityLive} = defineLive({
  client: liveClient,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: token,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: token,
})

// Wrapper that checks for perspective override via header (set by proxy for ?prodMode=true)
export const sanityFetch: typeof baseSanityFetch = async (options) => {
  const headersList = await headers()
  const perspectiveOverride = headersList.get('x-sanity-perspective')

  // Use header override if present, otherwise use environment-based default
  const perspective = perspectiveOverride === 'published'
    ? 'published'
    : isProduction
      ? 'published'
      : 'drafts'

  return baseSanityFetch({
    ...options,
    perspective,
  })
}
