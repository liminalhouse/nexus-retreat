'use client'

import {useEffect, useState} from 'react'

const STORAGE_KEY = 'sessionReminders'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export default function PushNotificationToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    setEnabled(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  async function enable() {
    // Enable in-app reminders immediately — no permission needed
    localStorage.setItem(STORAGE_KEY, 'true')
    setEnabled(true)

    // Best-effort Web Push subscription for background delivery (e.g. homescreen PWA)
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
        // Permission denied or unsupported — in-app reminders still work
      }
    }
  }

  async function disable() {
    localStorage.setItem(STORAGE_KEY, 'false')
    setEnabled(false)

    // Also unsubscribe from Web Push if active
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
      } catch {
        // Silent fail
      }
    }
  }

  // Avoid hydration mismatch — render nothing until localStorage is read
  if (enabled === null) return null

  return (
    <button
      onClick={enabled ? disable : enable}
      title={enabled ? 'Turn off session reminders' : 'Turn on session reminders'}
      aria-label={enabled ? 'Turn off session reminders' : 'Turn on session reminders'}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors py-1 px-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={enabled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        {!enabled && <line x1="1" y1="1" x2="23" y2="23" />}
      </svg>
      {enabled ? 'Reminders on' : 'Session reminders'}
    </button>
  )
}
