'use client'

import {useEffect, useRef, useState} from 'react'

const REMINDERS_KEY = 'sessionReminders'
const NOTIFIED_SESSIONS_KEY = 'notifiedSessions'
const LAST_NOTIF_CHECK_KEY = 'lastNotifCheck'
const SESSION_POLL_MS = 60_000
const ADMIN_POLL_MS = 30_000

type UpcomingSession = {
  _id: string
  title: string
  location: string | null
  startTime: string
  id: {current: string} | null
}

type Toast = {
  label?: string
  title: string
  body: string | null
  url?: string
}

export default function SessionNotifier() {
  const [toasts, setToasts] = useState<(Toast & {key: string})[]>([])
  const sessionsRef = useRef<UpcomingSession[]>([])

  function addToast(key: string, toast: Toast) {
    setToasts((prev) => (prev.find((t) => t.key === key) ? prev : [...prev, {key, ...toast}]))
  }

  function dismissToast(key: string) {
    setToasts((prev) => prev.filter((t) => t.key !== key))
  }

  // Session reminder polling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    async function init() {
      if (localStorage.getItem(REMINDERS_KEY) !== 'true') return
      const res = await fetch('/api/sessions').catch(() => null)
      if (!res?.ok) return
      sessionsRef.current = await res.json()
      checkSessions()
      interval = setInterval(checkSessions, SESSION_POLL_MS)
    }

    function checkSessions() {
      if (localStorage.getItem(REMINDERS_KEY) !== 'true') return
      const notified: string[] = JSON.parse(sessionStorage.getItem(NOTIFIED_SESSIONS_KEY) || '[]')
      const now = Date.now()
      const windowStart = now + 13 * 60 * 1000
      const windowEnd = now + 17 * 60 * 1000

      for (const session of sessionsRef.current) {
        const start = new Date(session.startTime).getTime()
        if (start >= windowStart && start <= windowEnd && !notified.includes(session._id)) {
          sessionStorage.setItem(NOTIFIED_SESSIONS_KEY, JSON.stringify([...notified, session._id]))
          addToast(`session-${session._id}`, {
            label: 'Starting in 15 min',
            title: session.title,
            body: session.location,
            url: session.id?.current ? `/schedule/${session.id.current}` : '/schedule',
          })
          break
        }
      }
    }

    init()
    return () => clearInterval(interval)
  }, [])

  // Admin notification polling (always active, regardless of reminder toggle)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    async function checkAdminNotifs() {
      const since = sessionStorage.getItem(LAST_NOTIF_CHECK_KEY) || new Date(Date.now() - 60_000).toISOString()
      sessionStorage.setItem(LAST_NOTIF_CHECK_KEY, new Date().toISOString())

      const res = await fetch(`/api/notifications?since=${encodeURIComponent(since)}`).catch(() => null)
      if (!res?.ok) return
      const notifications: {id: string; title: string; message: string}[] = await res.json()

      for (const notif of notifications) {
        addToast(`admin-${notif.id}`, {title: notif.title, body: notif.message})
      }
    }

    checkAdminNotifs()
    interval = setInterval(checkAdminNotifs, ADMIN_POLL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === REMINDERS_KEY && e.newValue !== 'true') {
        setToasts((prev) => prev.filter((t) => !t.key.startsWith('session-')))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.key}
          role="alert"
          className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-start gap-3"
        >
          <div className="flex-1 min-w-0">
            {toast.label && (
              <p className="text-xs font-semibold text-nexus-coral uppercase tracking-wide mb-0.5">
                {toast.label}
              </p>
            )}
            <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
            {toast.body && <p className="text-xs text-gray-500 mt-0.5">{toast.body}</p>}
            {toast.url && (
              <a href={toast.url} className="text-xs text-nexus-coral hover:underline mt-1 inline-block">
                View session
              </a>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.key)}
            aria-label="Dismiss"
            className="text-gray-400 hover:text-gray-600 mt-0.5 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
