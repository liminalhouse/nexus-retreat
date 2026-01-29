/**
 * This config is used to set up Sanity Studio that's mounted on the `/admin/cms` route
 *
 * IMPORTANT: This file is only imported on the client side
 */

'use client'

import {defineConfig, type SanityDocument} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'

// Import schemas
import {schemaTypes} from './sanity/schemas/schemaTypes'
import {structure} from './sanity/schemas/structure'
import {templates} from './sanity/schemas/lib/templates'

// Import custom components
import {PageNavigator} from './sanity/components/PageNavigator'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-25'

// Use Vercel's branch URL for automatic preview URLs, fallback to localhost
const PREVIEW_URL = process.env.VERCEL_BRANCH_URL
  ? `https://${process.env.VERCEL_BRANCH_URL}`
  : process.env.NEXT_PUBLIC_PREVIEW_URL || 'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Nexus Retreat CMS',
  basePath: '/admin/cms',
  projectId,
  dataset,
  apiVersion,

  plugins: [
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' && window.location.origin.includes('vercel.app')
          ? window.location.origin
          : PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      components: {
        unstable_navigator: {
          component: PageNavigator,
          minWidth: 250,
          maxWidth: 350,
        },
      },
    }),
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates,
  },

  document: {
    productionUrl: async (prev, context) => {
      const {document} = context
      const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('vercel.app')
        ? window.location.origin
        : PREVIEW_URL

      let path: string | null = null

      // Speaker preview: /speakers/<slug>
      if (document._type === 'speaker') {
        const slug = (document as SanityDocument & {id?: {current?: string}}).id?.current
        if (slug) {
          path = `/speakers/${slug}`
        }
      }

      // Session preview: /schedule/<slug>
      if (document._type === 'session') {
        const slug = (document as SanityDocument & {id?: {current?: string}}).id?.current
        if (slug) {
          path = `/schedule/${slug}`
        }
      }

      // Page preview: /<slug> or / for homepage
      if (document._type === 'page') {
        const slug = (document as SanityDocument & {slug?: {current?: string}}).slug?.current
        path = `/${slug || ''}`
      }

      if (path) {
        // Check if document is a draft (unpublished changes)
        const isDraft = document._id.startsWith('drafts.')
        if (isDraft) {
          // Route through draft mode enable endpoint (validates Sanity auth)
          const redirectPath = encodeURIComponent(path)
          return `${baseUrl}/api/draft-mode/enable?redirect=${redirectPath}`
        }
        return `${baseUrl}${path}`
      }

      return prev
    },
  },
})
