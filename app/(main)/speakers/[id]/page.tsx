import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {speakerByIdQuery} from '@/sanity/lib/queries'
import {urlForImage, cleanSlug} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import {type PortableTextBlock} from 'next-sanity'
import {getUser} from '@/lib/auth/getUser'
import {getSessionTypeLabel, getSessionTagLabel, getSessionTagColors} from '@/lib/sessionLabels'
import SessionPlaceholder from '@/app/components/SessionPlaceholder'

type Props = {
  params: Promise<{id: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id} = await params
  const {data: speaker} = await sanityFetch({
    query: speakerByIdQuery,
    params: {id},
    stega: false,
  })

  const name = speaker ? `${speaker.firstName} ${speaker.lastName}` : 'Speaker'

  return {
    title: `${name} | Nexus Retreat`,
    description: speaker?.title || `Learn more about ${name}`,
  }
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/New_York',
  })
}

export default async function SpeakerPage({params}: Props) {
  const user = await getUser()
  if (!user && process.env.SESSIONS_LIVE !== 'true') {
    notFound()
  }

  const {id} = await params
  const {data: speaker} = await sanityFetch({
    query: speakerByIdQuery,
    params: {id},
  })

  if (!speaker) {
    notFound()
  }

  const photoUrl = speaker.profilePicture
    ? urlForImage(speaker.profilePicture)?.width(400).height(400).fit('crop').url()
    : null

  return (
    <div className="bg-nexus-beige min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-16">
        {/* Back Link */}
        <Link
          href="/speakers"
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
          <span className="font-medium">Back to Speakers</span>
        </Link>

        <div className="max-w-4xl">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Photo */}
            <div className="flex-shrink-0">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={`${speaker.firstName} ${speaker.lastName}`}
                  width={200}
                  height={200}
                  className="rounded-2xl object-cover"
                  priority
                />
              ) : (
                <div className="w-[200px] h-[200px] rounded-2xl bg-gray-100 flex items-center justify-center">
                  <span className="text-5xl font-medium text-nexus-navy/30">
                    {speaker.firstName?.[0]}
                    {speaker.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-nexus-navy font-serif mb-2">
                {speaker.firstName} {speaker.lastName}
              </h1>
              {speaker.title && <p className="text-lg text-gray-600 mb-6">{speaker.title}</p>}

              {/* Bio */}
              {speaker.bio && (
                <div className="prose prose-lg max-w-none">
                  <CustomPortableText value={speaker.bio as PortableTextBlock[]} />
                </div>
              )}
            </div>
          </div>

          {/* Sessions */}
          {speaker.sessions && speaker.sessions.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-semibold text-nexus-navy font-serif mb-6">Sessions</h2>
              <div className="space-y-4">
                {speaker.sessions.map((session) => {
                  const sessionPhotoUrl = session.photo
                    ? urlForImage(session.photo)?.width(200).height(120).fit('crop').url()
                    : null
                  const sessionSlug = cleanSlug(session.id?.current) || session._id

                  return (
                    <Link
                      key={session._id}
                      href={`/schedule/${sessionSlug}`}
                      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-nexus-coral/30 transition-all"
                    >
                      <div className="relative w-full sm:w-40 h-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        {sessionPhotoUrl ? (
                          <Image
                            src={sessionPhotoUrl}
                            alt={session.title || 'Session photo'}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        ) : (
                          <SessionPlaceholder
                            tag={session.sessionTags?.[0]}
                            className="w-full h-full"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Session Type & Tags */}
                        {((session.sessionType && session.sessionType.length > 0) ||
                          (session.sessionTags && session.sessionTags.length > 0)) && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {session.sessionType?.map((type) => (
                              <span
                                key={type}
                                className="inline-block px-2 py-0.5 text-xs font-medium bg-nexus-navy text-white rounded-full"
                              >
                                {getSessionTypeLabel(type)}
                              </span>
                            ))}
                            {session.sessionTags?.map((tag) => {
                              const colors = getSessionTagColors(tag)
                              return (
                                <span
                                  key={tag}
                                  className={`inline-block px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} rounded-full`}
                                >
                                  {getSessionTagLabel(tag)}
                                </span>
                              )
                            })}
                          </div>
                        )}

                        <h3 className="text-lg font-semibold text-nexus-navy mb-1">
                          {session.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          {session.startTime && <span>{formatDate(session.startTime)}</span>}
                          {session.startTime && session.endTime && (
                            <span>
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </span>
                          )}
                          {session.location && <span>{session.location}</span>}
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
