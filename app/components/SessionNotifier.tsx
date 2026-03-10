'use client'

import {useEffect, useRef, useState} from 'react'
import {pushNotification, markUnread, type StoredNotification} from '@/lib/notifications'

const REMINDERS_KEY = 'sessionReminders'
const NOTIFIED_SESSIONS_KEY = 'notifiedSessions'
const LAST_NOTIF_CHECK_KEY = 'lastNotifCheck'
const SESSION_POLL_MS = 60_000
const SESSION_REFRESH_MS = 30 * 60_000
const ADMIN_POLL_MS = 5_000
const NOTIFIED_TTL_MS = 24 * 60 * 60_000
const TOAST_DURATION_MS = 30_000

type UpcomingSession = {
  _id: string
  title: string
  location: string | null
  startTime: string
  id: {current: string} | null
}

type ToastEntry = StoredNotification & {key: string}

type NotifiedEntry = {id: string; notifiedAt: number}

function getNotifiedSessions(): NotifiedEntry[] {
  try {
    const entries: NotifiedEntry[] = JSON.parse(
      localStorage.getItem(NOTIFIED_SESSIONS_KEY) || '[]',
    )
    return entries.filter((e) => Date.now() - e.notifiedAt < NOTIFIED_TTL_MS)
  } catch {
    return []
  }
}

function markSessionNotified(sessionId: string) {
  const notified = getNotifiedSessions()
  notified.push({id: sessionId, notifiedAt: Date.now()})
  localStorage.setItem(NOTIFIED_SESSIONS_KEY, JSON.stringify(notified))
}

async function fetchSessions(): Promise<UpcomingSession[]> {
  const res = await fetch('/api/sessions').catch(() => null)
  if (!res?.ok) return []
  return res.json()
}

export default function SessionNotifier() {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const sessionsRef = useRef<UpcomingSession[]>([])
  // Tracks auto-dismiss timers by toast key — clearing a timer cancels the pushNotification call
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Clean up all timers on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  function addToast(key: string, notif: StoredNotification) {
    // Add to history and increment badge immediately — always, regardless of whether
    // the user sees the toast or not.
    pushNotification(notif)
    markUnread()
    setToasts((prev) => (prev.find((t) => t.key === key) ? prev : [{key, ...notif}, ...prev]))

    // Auto-dismiss after 30s
    const timer = setTimeout(() => {
      timersRef.current.delete(key)
      setToasts((prev) => prev.filter((t) => t.key !== key))
    }, TOAST_DURATION_MS)
    timersRef.current.set(key, timer)
  }

  function dismissToast(key: string) {
    // User saw and dismissed it — cancel the timer so the badge doesn't increment
    const timer = timersRef.current.get(key)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(key)
    }
    setToasts((prev) => prev.filter((t) => t.key !== key))
  }

  // Session reminder polling + periodic refresh
  useEffect(() => {
    let sessionInterval: ReturnType<typeof setInterval>
    let refreshInterval: ReturnType<typeof setInterval>

    async function init() {
      if (localStorage.getItem(REMINDERS_KEY) !== 'true') return
      sessionsRef.current = await fetchSessions()
      checkSessions()
      sessionInterval = setInterval(checkSessions, SESSION_POLL_MS)
      refreshInterval = setInterval(async () => {
        sessionsRef.current = await fetchSessions()
      }, SESSION_REFRESH_MS)
    }

    function checkSessions() {
      if (localStorage.getItem(REMINDERS_KEY) !== 'true') return
      const notifiedIds = new Set(getNotifiedSessions().map((e) => e.id))
      const now = Date.now()
      const windowStart = now + 13 * 60 * 1000
      const windowEnd = now + 17 * 60 * 1000

      for (const session of sessionsRef.current) {
        const start = new Date(session.startTime).getTime()
        if (start >= windowStart && start <= windowEnd && !notifiedIds.has(session._id)) {
          markSessionNotified(session._id)
          addToast(`session-${session._id}`, {
            id: `session-${session._id}`,
            title: session.title,
            body: session.location,
            timestamp: Date.now(),
            url: session.id?.current ? `/schedule/${session.id.current}` : '/schedule',
          })
          break
        }
      }
    }

    init()
    return () => {
      clearInterval(sessionInterval)
      clearInterval(refreshInterval)
    }
  }, [])

  // Admin notification polling (always active)
  useEffect(() => {
    async function checkAdminNotifs() {
      const since =
        sessionStorage.getItem(LAST_NOTIF_CHECK_KEY) ||
        new Date(Date.now() - 60_000).toISOString()
      sessionStorage.setItem(LAST_NOTIF_CHECK_KEY, new Date().toISOString())

      const res = await fetch(`/api/notifications?since=${encodeURIComponent(since)}`).catch(
        () => null,
      )
      if (!res?.ok) return
      const notifications: {id: string; title: string; message: string}[] = await res.json()
      for (const notif of notifications) {
        addToast(`admin-${notif.id}`, {
          id: `admin-${notif.id}`,
          title: notif.title,
          body: notif.message,
          timestamp: Date.now(),
        })
      }
    }

    checkAdminNotifs()
    const interval = setInterval(checkAdminNotifs, ADMIN_POLL_MS)
    return () => clearInterval(interval)
  }, [])

  // Clear session toasts if reminders toggled off in another tab
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === REMINDERS_KEY && e.newValue !== 'true') {
        setToasts((prev) => {
          prev
            .filter((t) => t.key.startsWith('session-'))
            .forEach((t) => {
              const timer = timersRef.current.get(t.key)
              if (timer) {
                clearTimeout(timer)
                timersRef.current.delete(t.key)
              }
            })
          return prev.filter((t) => !t.key.startsWith('session-'))
        })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.key}
          role="alert"
          className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-start gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
            {toast.body && <p className="text-xs text-gray-500 mt-0.5">{toast.body}</p>}
            {toast.url && (
              <a
                href={toast.url}
                className="text-xs text-nexus-coral hover:underline mt-1 inline-block"
              >
                View session
              </a>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.key)}
            aria-label="Dismiss"
            className="text-gray-400 hover:text-gray-600 mt-0.5 shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
