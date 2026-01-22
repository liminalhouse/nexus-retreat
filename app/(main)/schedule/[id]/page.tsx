import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {sessionByIdQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import {type PortableTextBlock} from 'next-sanity'
import {getUser} from '@/lib/auth/getUser'
import {getSessionTypeLabel, getSessionTagLabel, getSessionTagColors} from '@/lib/sessionLabels'

type Props = {
  params: Promise<{id: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id} = await params
  const {data: session} = await sanityFetch({
    query: sessionByIdQuery,
    params: {id},
    stega: false,
  })

  return {
    title: session?.title ? `${session.title} | Nexus Retreat` : 'Session | Nexus Retreat',
    description: session?.title || 'View session details',
  }
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function SessionPage({params}: Props) {
  const user = await getUser()
  if (!user || process.env.SESSIONS_LIVE !== 'true') {
    notFound()
  }

  const {id} = await params
  const {data: session} = await sanityFetch({
    query: sessionByIdQuery,
    params: {id},
  })

  if (!session) {
    notFound()
  }

  const photoUrl = session.photo
    ? urlForImage(session.photo)?.width(1200).height(600).fit('crop').url()
    : null

  return (
    <div className="bg-nexus-beige min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-16">
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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Photo */}
            {photoUrl && (
              <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-8">
                <Image
                  src={photoUrl}
                  alt={session.title || 'Session photo'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
            )}

            {/* Session Type & Tags */}
            {((session.sessionType && session.sessionType.length > 0) ||
              (session.sessionTags && session.sessionTags.length > 0)) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {session.sessionType?.map((type) => (
                  <Link
                    key={type}
                    href={`/schedule?type=${encodeURIComponent(type)}`}
                    className="inline-block px-3 py-1 text-sm font-medium bg-nexus-navy text-white rounded-full hover:opacity-80 transition-all"
                  >
                    {getSessionTypeLabel(type)}
                  </Link>
                ))}
                {session.sessionTags?.map((tag) => {
                  const colors = getSessionTagColors(tag)
                  return (
                    <Link
                      key={tag}
                      href={`/schedule?tag=${encodeURIComponent(tag)}`}
                      className={`inline-block px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text} rounded-full hover:opacity-80 transition-all`}
                    >
                      {getSessionTagLabel(tag)}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-nexus-navy font-serif mb-6">
              {session.title}
            </h1>

            {/* Date, Time & Location */}
            <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
              {session.startTime && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formatDate(session.startTime)}</span>
                </div>
              )}
              {session.startTime && session.endTime && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>
              )}
              {session.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{session.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {session.description && (
              <div className="prose prose-lg max-w-none">
                <CustomPortableText value={session.description as PortableTextBlock[]} />
              </div>
            )}
          </div>

          {/* Speakers Sidebar */}
          {session.speakers && session.speakers.length > 0 && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-[86px]">
                <h2 className="text-xl font-semibold text-nexus-navy font-serif mb-4">
                  {session.speakers.length === 1 ? 'Speaker' : 'Speakers'}
                </h2>
                <div className="space-y-4">
                  {session.speakers.map((speaker) => {
                    const speakerPhotoUrl = speaker.profilePicture
                      ? urlForImage(speaker.profilePicture)
                          ?.width(200)
                          .height(200)
                          .fit('crop')
                          .url()
                      : null
                    const speakerSlug = speaker.id?.current || speaker._id

                    return (
                      <Link
                        key={speaker._id}
                        href={`/speakers/${speakerSlug}`}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-nexus-coral/30 transition-all"
                      >
                        {speakerPhotoUrl ? (
                          <Image
                            src={speakerPhotoUrl}
                            alt={`${speaker.firstName} ${speaker.lastName}`}
                            width={64}
                            height={64}
                            className="rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-nexus-coral-light flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-medium text-nexus-navy">
                              {speaker.firstName?.[0]}
                              {speaker.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-nexus-navy">
                            {speaker.firstName} {speaker.lastName}
                          </h3>
                          {speaker.title && (
                            <p className="text-sm text-gray-600 line-clamp-2">{speaker.title}</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
