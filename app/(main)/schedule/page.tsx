import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {sessionsQuery} from '@/sanity/lib/queries'
import {urlForImage, cleanSlug} from '@/sanity/lib/utils'
import {getUser} from '@/lib/auth/getUser'
import type {SessionsQueryResult} from '@/sanity.types'
import {getSessionTypeLabel, getSessionTagLabel, getSessionTagColors} from '@/lib/sessionLabels'
import {SessionTagsGroup} from '@/app/components/SessionTags'
import SessionPlaceholder from '@/app/components/SessionPlaceholder'

export const metadata: Metadata = {
  title: 'Schedule | Nexus Retreat',
}

type Session = SessionsQueryResult[number]
type Speaker = NonNullable<Session['speakers']>[number]

type Props = {
  searchParams: Promise<{tag?: string; type?: string}>
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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  })
}

function getDateKey(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York',
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

function SessionListItem({
  session,
  activeTag,
  activeType,
}: {
  session: Session
  activeTag: string | null
  activeType: string | null
}) {
  const photoUrl = session.photo
    ? urlForImage(session.photo)?.width(240).height(160).fit('crop').url()
    : null

  const sessionSlug = cleanSlug(session.id?.current) || session._id

  return (
    <div className="relative flex flex-col sm:flex-row items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-nexus-coral/30 transition-all duration-300">
      {/* Main clickable area */}
      <Link href={`/schedule/${sessionSlug}`} className="absolute inset-0 z-0" />

      {/* Photo or Placeholder */}
      <div className="relative w-full sm:w-36 h-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={session.title || 'Session photo'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 144px"
          />
        ) : (
          <SessionPlaceholder tag={session.sessionTags?.[0]} className="w-full h-full" />
        )}
      </div>

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

        {/* Session Type & Title */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold text-nexus-navy font-serif">{session.title}</h3>
        </div>

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
                  const speakerSlug = cleanSlug(speaker.id?.current) || speaker._id
                  return (
                    <Link
                      key={speaker._id}
                      href={`/speakers/${speakerSlug}`}
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
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
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
                  const speakerSlug = cleanSlug(speaker.id?.current) || speaker._id
                  return (
                    <span key={speaker._id}>
                      <Link
                        href={`/speakers/${speakerSlug}`}
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

          {/* Session Type & Tags */}
          <SessionTagsGroup
            types={session.sessionType}
            tags={session.sessionTags}
            asLinks
            activeType={activeType}
            activeTag={activeTag}
          />
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
  if (!user && process.env.SESSIONS_LIVE !== 'true') {
    notFound()
  }

  const {tag: activeTag, type: activeType} = await searchParams
  const {data: sessions} = await sanityFetch({query: sessionsQuery})

  let filteredSessions = sessions || []
  if (activeTag) {
    filteredSessions = filteredSessions.filter((session) =>
      session.sessionTags?.includes(activeTag),
    )
  }
  if (activeType) {
    filteredSessions = filteredSessions.filter((session) =>
      session.sessionType?.includes(activeType),
    )
  }

  const groupedSessions = groupSessionsByDay(filteredSessions)

  return (
    <div className="bg-nexus-beige min-h-screen">
      <div className="container mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-nexus-navy font-serif mb-4">
            Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our exciting lineup of sessions with world-class speakers.
          </p>
        </div>

        {/* Active filter */}
        {(activeTag || activeType) && (
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <span className="text-gray-600">Filtering by:</span>
            {activeType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-navy text-white text-sm font-medium rounded-full">
                {getSessionTypeLabel(activeType)}
                <Link
                  href={activeTag ? `/schedule?tag=${encodeURIComponent(activeTag)}` : '/schedule'}
                  className="hover:opacity-60 rounded-full p-0.5 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Link>
              </span>
            )}
            {activeTag &&
              (() => {
                const colors = getSessionTagColors(activeTag)
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 ${colors.bg} ${colors.text} ${colors.border} text-sm font-medium rounded-full`}
                  >
                    {getSessionTagLabel(activeTag)}
                    <Link
                      href={
                        activeType
                          ? `/schedule?type=${encodeURIComponent(activeType)}`
                          : '/schedule'
                      }
                      className="hover:opacity-60 rounded-full p-0.5 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Link>
                  </span>
                )
              })()}
          </div>
        )}

        {/* Sessions by Day */}
        {groupedSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTag || activeType
                ? `No sessions found with the selected filter${activeTag && activeType ? 's' : ''}.`
                : 'No sessions scheduled yet. Check back soon!'}
            </p>
            {(activeTag || activeType) && (
              <Link href="/schedule" className="inline-block mt-4 text-nexus-coral hover:underline">
                Clear filter{activeTag && activeType ? 's' : ''}
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
                      activeType={activeType || null}
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
