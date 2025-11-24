import type {Metadata} from 'next'
import Head from 'next/head'

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
    title: page?.name,
    description: page?.heading,
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
      <Head>
        <title>{page.heading}</title>
      </Head>
      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  )
}
