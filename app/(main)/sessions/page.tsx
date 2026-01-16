import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {sessionsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

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

function SessionListItem({session}: {session: Session}) {
  const photoUrl = session.photo
    ? urlForImage(session.photo)?.width(300).height(200).fit('crop').url()
    : null

  const sessionSlug = session.id?.current || session._id

  return (
    <Link
      href={`/sessions/${sessionSlug}`}
      className="block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:border-nexus-coral/30 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row">
        {/* Photo */}
        {photoUrl && (
          <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
            <Image
              src={photoUrl}
              alt={session.title || 'Session photo'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
        )}

        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* Tags */}
            {session.tags && session.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {session.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2.5 py-0.5 text-xs font-medium bg-nexus-coral/10 text-nexus-navy rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-semibold text-nexus-navy mb-2 font-serif group-hover:text-nexus-coral transition-colors">
              {session.title}
            </h3>

            {/* Time & Location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {session.startTime && session.endTime && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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

            {/* Speakers */}
            {session.speakers && session.speakers.length > 0 && (
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {session.speakers.length === 1 ? 'Speaker' : 'Speakers'}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {session.speakers.map((speaker) => {
                      const speakerPhotoUrl = speaker.profilePicture
                        ? urlForImage(speaker.profilePicture)?.width(64).height(64).fit('crop').url()
                        : null

                      return (
                        <div key={speaker._id} className="flex items-center gap-2">
                          {speakerPhotoUrl ? (
                            <Image
                              src={speakerPhotoUrl}
                              alt={`${speaker.firstName} ${speaker.lastName}`}
                              width={24}
                              height={24}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-nexus-navy/10 flex items-center justify-center">
                              <span className="text-[10px] font-medium text-nexus-navy">
                                {speaker.firstName?.[0]}
                                {speaker.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700">
                            {speaker.firstName} {speaker.lastName}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="hidden md:flex items-center pr-6">
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
      </div>
    </Link>
  )
}

export default async function SessionsPage() {
  const {data: sessions} = await sanityFetch({query: sessionsQuery})

  const groupedSessions = groupSessionsByDay(sessions || [])

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

        {/* Sessions by Day */}
        {groupedSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No sessions scheduled yet. Check back soon!</p>
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
                <div className="space-y-4">
                  {group.sessions.map((session) => (
                    <SessionListItem key={session._id} session={session} />
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
