import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {speakersQuery} from '@/sanity/lib/queries'
import {urlForImage, cleanSlug} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import {type PortableTextBlock} from 'next-sanity'
import type {SpeakersQueryResult} from '@/sanity.types'

export const metadata: Metadata = {
  title: 'Speakers | Nexus Retreat',
  description: 'Meet our speakers at Nexus Retreat',
}

type Speaker = SpeakersQueryResult[number]

function SpeakerCard({speaker}: {speaker: Speaker}) {
  const photoUrl = speaker.profilePicture
    ? urlForImage(speaker.profilePicture)?.width(200).height(200).fit('crop').url()
    : null

  const speakerSlug = cleanSlug(speaker.id?.current) || speaker._id

  return (
    <Link
      href={`/speakers/${speakerSlug}`}
      className="flex flex-col sm:flex-row md:h-full bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:border-nexus-coral/30 transition-all duration-300 p-5 gap-4 sm:gap-5"
    >
      {/* Circular Photo */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 mx-auto sm:mx-0">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${speaker.firstName} ${speaker.lastName}`}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-medium text-nexus-navy/30">
              {speaker.firstName?.[0]}
              {speaker.lastName?.[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 sm:text-left">
        {/* Name */}
        <h3 className="text-lg font-semibold text-nexus-navy font-serif text-center md:text-left">
          {speaker.firstName} {speaker.lastName}
        </h3>

        {/* Title */}
        {speaker.title && (
          <p className="text-xs text-nexus-navy font-semibold mt-0.5 mb-2 line-clamp-1 text-center md:text-left">{speaker.title}</p>
        )}

        {/* Bio preview */}
        {speaker.bio && (
          <div className="text-gray-600 text-sm leading-relaxed line-clamp-6 mt-2 text-left">
            <CustomPortableText value={speaker.bio as PortableTextBlock[]} />
          </div>
        )}

        <div className="mt-auto pt-3">
          <span className="text-sm text-nexus-coral font-medium">View profile →</span>
        </div>
      </div>
    </Link>
  )
}

export default async function SpeakersPage() {
  const {data: speakers} = await sanityFetch({query: speakersQuery})

  return (
    <div className="bg-nexus-beige min-h-screen">
      <div className="container mx-auto px-6 py-16 md:py-24">
        {/* Back Link */}
        <Link
          href="/schedule"
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
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the world leaders and industry experts sharing their insights at the Retreat.
          </p>
        </div>

        {/* Speakers Grid */}
        {!speakers || speakers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No speakers announced yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 md:auto-rows-fr lg:grid-cols-3">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker._id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
