import {cookies} from 'next/headers'
import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'
import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/lib/client'
import {token} from '@/sanity/lib/token'
import {getSanityUserInfo} from '@/lib/sanity/auth'

/**
 * defineEnableDraftMode() is used to enable draft mode. Set the route of this file
 * as the previewMode.enable option for presentationTool in your sanity.config.ts
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#5-integrating-with-sanity-presentation-tool--visual-editing
 */

const {GET: enableDraftMode} = defineEnableDraftMode({
  client: client.withConfig({token}),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const redirectPath = url.searchParams.get('redirect')

  // If redirect param is provided, validate Sanity auth and enable draft mode
  if (redirectPath) {
    // Check for Sanity auth token in cookies
    const cookieStore = await cookies()
    const sanityToken = cookieStore.get('sanity-token')?.value

    if (!sanityToken) {
      return new Response('Unauthorized: Please log in to Sanity Studio first', {status: 401})
    }

    // Validate the token is still valid
    const userInfo = await getSanityUserInfo(sanityToken)
    if (!userInfo) {
      return new Response('Unauthorized: Invalid or expired Sanity session', {status: 401})
    }

    // Validate redirect path to prevent open redirect attacks
    // Only allow relative paths starting with /
    if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) {
      return new Response('Invalid redirect path', {status: 400})
    }

    const draft = await draftMode()
    draft.enable()
    redirect(redirectPath)
  }

  // Otherwise use the default handler (for presentation tool with secret validation)
  return enableDraftMode(request)
}
