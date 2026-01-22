import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {sessionsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import {getUser} from '@/lib/auth/getUser'

export const metadata: Metadata = {
  title: 'Sessions | Nexus Retreat',
  description: 'View all sessions at Nexus Retreat',
}

type Speaker = {
  _id: string
  id?: {current?: string}
  firstName?: string
  lastName?: string
  title?: string
  profilePicture?: any
}

type Session = {
  _id: string
  id?: {current?: string}
  title?: string
  description?: any
  startTime?: string
  endTime?: string
  location?: string
  tags?: string[]
  photo?: any
  speakers?: Speaker[]
}

type Props = {
  searchParams: Promise<{tag?: string}>
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

function getDateKey(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function groupSessionsByDay(sessions: Session[]) {
  const grouped: Record<string, {date: string; sessions: Session[]}> = {}

  for (const session of sessions) {
    if (!session.startTime) continue

    const dateKey = getDateKey(session.startTime)
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: formatDate(session.startTime),
        sessions: [],
      }
    }
    grouped[dateKey].sessions.push(session)
  }

  return Object.values(grouped)
}

function SessionListItem({session, activeTag}: {session: Session; activeTag: string | null}) {
  const photoUrl = session.photo
    ? urlForImage(session.photo)?.width(240).height(160).fit('crop').url()
    : null

  const sessionSlug = session.id?.current || session._id

  return (
    <div className="relative flex flex-col sm:flex-row items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-nexus-coral/30 transition-all duration-300">
      {/* Main clickable area */}
      <Link href={`/sessions/${sessionSlug}`} className="absolute inset-0 z-0" />

      {/* Photo */}
      {photoUrl && (
        <div className="relative w-full sm:w-36 h-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={photoUrl}
            alt={session.title || 'Session photo'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 144px"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Time & Location */}
        <div className="flex items-center gap-x-4 text-sm text-gray-500 mb-1">
          {session.startTime && session.endTime && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {formatTime(session.startTime)} – {formatTime(session.endTime)}
              </span>
            </div>
          )}
          {session.location && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Title */}
        <h3 className="text-lg font-semibold text-nexus-navy font-serif">{session.title}</h3>

        {/* Speakers & Tags row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 relative z-10">
          {/* Speakers */}
          {session.speakers && session.speakers.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {session.speakers.map((speaker) => {
                  const speakerPhotoUrl = speaker.profilePicture
                    ? urlForImage(speaker.profilePicture)?.width(64).height(64).fit('crop').url()
                    : null
                  const speakerSlug = speaker.id?.current || speaker._id
                  return (
                    <Link
                      key={speaker._id}
                      href={`/sessions/speakers/${speakerSlug}`}
                      className="relative hover:z-10 transition-transform hover:scale-110"
                    >
                      {speakerPhotoUrl ? (
                        <Image
                          src={speakerPhotoUrl}
                          alt={`${speaker.firstName} ${speaker.lastName}`}
                          width={28}
                          height={28}
                          className="rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-nexus-navy/10 flex items-center justify-center border-2 border-white">
                          <span className="text-[10px] font-medium text-nexus-navy">
                            {speaker.firstName?.[0]}
                            {speaker.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-x-1">
                {session.speakers.map((speaker, index) => {
                  const speakerSlug = speaker.id?.current || speaker._id
                  return (
                    <span key={speaker._id}>
                      <Link
                        href={`/sessions/speakers/${speakerSlug}`}
                        className="text-sm text-gray-600 hover:text-nexus-coral transition-colors"
                      >
                        {speaker.firstName} {speaker.lastName}
                      </Link>
                      {index < session.speakers!.length - 1 && (
                        <span className="text-gray-400">, </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/sessions?tag=${encodeURIComponent(tag)}`}
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                    activeTag === tag
                      ? 'bg-nexus-coral text-white'
                      : 'bg-nexus-coral/10 text-nexus-navy hover:bg-nexus-coral/20'
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0 hidden sm:block self-center"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

export default async function SessionsPage({searchParams}: Props) {
  const user = await getUser()
  if (!user && process.env.SESSIONS_LIVE === 'true') {
    notFound()
  }

  const {tag: activeTag} = await searchParams
  const {data: sessions} = await sanityFetch({query: sessionsQuery})

  const filteredSessions = activeTag
    ? (sessions || []).filter((session) => session.tags?.includes(activeTag))
    : sessions || []

  const groupedSessions = groupSessionsByDay(filteredSessions)

  return (
    <div className="bg-nexus-beige min-h-screen">
      <div className="container mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-nexus-navy font-serif mb-4">
            Sessions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our lineup of sessions, workshops, and keynotes.
          </p>
        </div>

        {/* Active filter */}
        {activeTag && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-gray-600">Filtering by:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-coral text-white text-sm font-medium rounded-full">
              {activeTag}
              <Link
                href="/sessions"
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </span>
          </div>
        )}

        {/* Sessions by Day */}
        {groupedSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTag
                ? `No sessions found with tag "${activeTag}".`
                : 'No sessions scheduled yet. Check back soon!'}
            </p>
            {activeTag && (
              <Link href="/sessions" className="inline-block mt-4 text-nexus-coral hover:underline">
                Clear filter
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {groupedSessions.map((group) => (
              <section key={group.date}>
                {/* Day Header */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-nexus-navy font-serif">
                    {group.date}
                  </h2>
                  <div className="mt-2 h-1 w-20 bg-nexus-coral rounded-full" />
                </div>

                {/* Sessions List */}
                <div className="space-y-3">
                  {group.sessions.map((session) => (
                    <SessionListItem
                      key={session._id}
                      session={session}
                      activeTag={activeTag || null}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
