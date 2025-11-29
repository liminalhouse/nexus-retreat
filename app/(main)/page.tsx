import type {Metadata} from 'next'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
import {getBgColorClass} from '@/lib/utils/bgColor'

/**
 * Generate metadata for the homepage.
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: null},
    stega: false,
  })

  return {
    title: page?.name || 'Nexus Retreat',
    description: page?.heading || 'An invitation-only gathering for international sports leaders.',
  } satisfies Metadata
}

export default async function HomePage() {
  const [{data: page}] = await Promise.all([
    sanityFetch({query: getPageQuery, params: {slug: null}}),
  ])

  if (!page?._id) {
    return <div className="py-40">Not found.</div>
  }

  const bgColorClass = getBgColorClass(page.bgColor)

  return (
    <div className={bgColorClass}>
      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  )
}
