import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  studioHost: 'nexus-retreat',
  typegen: {
    path: './sanity/**/*.{ts,tsx,js,jsx}',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
