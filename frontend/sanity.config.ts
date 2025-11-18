/**
 * This config is used to set up Sanity Studio that's mounted on the `/admin/cms` route
 *
 * IMPORTANT: This file is only imported on the client side
 */

'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'

// Import from studio
import {schemaTypes} from '../studio/src/schemaTypes'
import {structure} from '../studio/src/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25'

const PREVIEW_URL = process.env.NEXT_PUBLIC_PREVIEW_URL || 'http://localhost:3000'

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
        origin: PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
