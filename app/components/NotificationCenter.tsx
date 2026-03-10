'use client'

import {useEffect, useRef, useState} from 'react'
import {BellIcon} from '@heroicons/react/24/outline'
import {BellAlertIcon} from '@heroicons/react/24/solid'
import {
  getNotificationHistory,
  getUnreadCount,
  clearUnreadCount,
  type StoredNotification,
} from '@/lib/notifications'
import {urlBase64ToUint8Array} from '@/lib/urlBase64'

const REMINDERS_KEY = 'sessionReminders'

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [history, setHistory] = useState<StoredNotification[]>([])
  const [remindersEnabled, setRemindersEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUnread(getUnreadCount())
    setHistory(getNotificationHistory())
    setRemindersEnabled(localStorage.getItem(REMINDERS_KEY) === 'true')
    setMounted(true)
  }, [])

  // Listen for new notifications dispatched by SessionNotifier
  useEffect(() => {
    function onNotification(e: Event) {
      const notif = (e as CustomEvent<StoredNotification>).detail
      setHistory((prev) => [notif, ...prev].slice(0, 30))
      setUnread((prev) => prev + 1)
    }
    window.addEventListener('nexus:notification', onNotification)
    return () => window.removeEventListener('nexus:notification', onNotification)
  }, [])

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return
    function onPointerDown(e: PointerEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [isOpen])

  function handleBellClick() {
    const opening = !isOpen
    setIsOpen(opening)
    if (opening && unread > 0) {
      setUnread(0)
      clearUnreadCount()
      setHistory(getNotificationHistory())
    }
  }

  async function enableReminders() {
    localStorage.setItem(REMINDERS_KEY, 'true')
    setRemindersEnabled(true)
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
          ),
        })
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(sub.toJSON()),
        })
      } catch {
        // Permission denied — in-app reminders still work
      }
    }
  }

  async function disableReminders() {
    localStorage.setItem(REMINDERS_KEY, 'false')
    setRemindersEnabled(false)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration('/sw.js')
        if (reg) {
          const sub = await reg.pushManager.getSubscription()
          if (sub) {
            await sub.unsubscribe()
            await fetch('/api/push/unsubscribe', {
              method: 'DELETE',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({endpoint: sub.endpoint}),
            })
          }
        }
      } catch {}
    }
  }

  if (!mounted) return null

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleBellClick}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        className="relative flex items-center justify-center p-1.5 text-gray-500 hover:text-gray-800 transition-colors"
      >
        {unread > 0 ? (
          <BellAlertIcon className="w-5 h-5 text-nexus-coral" />
        ) : (
          <BellIcon className="w-5 h-5" />
        )}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-nexus-coral text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[200] overflow-hidden">
          {/* Reminders toggle */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Session reminders</p>
              <p className="text-xs text-gray-400 mt-0.5">15 min before each session</p>
            </div>
            <button
              onClick={remindersEnabled ? disableReminders : enableReminders}
              role="switch"
              aria-checked={remindersEnabled}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
                remindersEnabled ? 'bg-nexus-coral' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  remindersEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notification history */}
          <div className="max-h-80 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8 px-4">No notifications yet</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {history.map((n) => {
                  const inner = (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 leading-snug">{n.title}</p>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0 mt-px">
                          {relativeTime(n.timestamp)}
                        </span>
                      </div>
                      {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                    </>
                  )
                  return (
                    <li key={n.id} className="px-4 py-3">
                      {n.url ? (
                        <a
                          href={n.url}
                          onClick={() => setIsOpen(false)}
                          className="block hover:opacity-75 transition-opacity"
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
