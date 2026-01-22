import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {speakersQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import {type PortableTextBlock} from 'next-sanity'
import {getUser} from '@/lib/auth/getUser'
import type {SpeakersQueryResult} from '@/sanity.types'

export const metadata: Metadata = {
  title: 'Speakers | Nexus Retreat',
  description: 'Meet our speakers at Nexus Retreat',
}

type Speaker = SpeakersQueryResult[number]

function SpeakerCard({speaker}: {speaker: Speaker}) {
  const photoUrl = speaker.profilePicture
    ? urlForImage(speaker.profilePicture)?.width(400).height(400).fit('crop').url()
    : null

  const speakerSlug = speaker.id?.current || speaker._id

  return (
    <Link
      href={`/sessions/speakers/${speakerSlug}`}
      className="block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:border-nexus-coral/30 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-64 w-full bg-nexus-navy/5">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${speaker.firstName} ${speaker.lastName}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-medium text-nexus-navy/30">
              {speaker.firstName?.[0]}
              {speaker.lastName?.[0]}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Name */}
        <h3 className="text-xl font-semibold text-nexus-navy font-serif mb-1">
          {speaker.firstName} {speaker.lastName}
        </h3>

        {/* Title */}
        {speaker.title && <p className="text-sm text-gray-600 mb-4">{speaker.title}</p>}

        {/* Bio preview */}
        {speaker.bio && (
          <div className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            <CustomPortableText value={speaker.bio as PortableTextBlock[]} />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-nexus-coral font-medium">View profile →</span>
        </div>
      </div>
    </Link>
  )
}

export default async function SpeakersPage() {
  const user = await getUser()
  if (!user || process.env.SESSIONS_LIVE === 'true') {
    notFound()
  }

  const {data: speakers} = await sanityFetch({query: speakersQuery})

  return (
    <div className="bg-nexus-beige min-h-screen">
      <div className="container mx-auto px-6 py-16 md:py-24">
        {/* Back Link */}
        <Link
          href="/sessions"
          className="inline-flex items-center gap-2 text-nexus-navy hover:text-nexus-coral transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back to Sessions</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-nexus-navy font-serif mb-4">
            Speakers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the experts and thought leaders presenting at Nexus Retreat.
          </p>
        </div>

        {/* Speakers Grid */}
        {!speakers || speakers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No speakers announced yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker._id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
