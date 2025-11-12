import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Hero from '@/app/components/Hero'

export default async function Page() {
  const {data: homepage} = await sanityFetch({
    query: homepageQuery,
  })

  const hero = homepage?.pageBuilder?.find((block: any) => block._type === 'hero')

  return <div className="min-h-screen">{hero && <Hero hero={hero} />}</div>
}
