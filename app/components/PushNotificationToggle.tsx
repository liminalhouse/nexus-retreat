'use client'

import {useEffect, useState} from 'react'

type PushState = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export default function PushNotificationToggle() {
  const [state, setState] = useState<PushState>('loading')

  useEffect(() => {
    if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        setState(sub ? 'subscribed' : 'unsubscribed')
      })
      .catch(() => setState('unsubscribed'))
  }, [])

  async function enable() {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sub.toJSON()),
      })
      setState('subscribed')
    } catch {
      if (Notification.permission === 'denied') {
        setState('denied')
      }
    }
  }

  async function disable() {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await sub.unsubscribe()
      await fetch('/api/push/unsubscribe', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({endpoint: sub.endpoint}),
      })
    }
    setState('unsubscribed')
  }

  if (state === 'loading') return null

  if (state === 'unsupported') {
    return (
      <p className="text-xs text-gray-400 text-center py-1">
        Push notifications not supported in this browser.
      </p>
    )
  }

  if (state === 'denied') {
    return (
      <p className="text-xs text-gray-400 text-center py-1">
        Notifications blocked. Enable them in browser settings to get session reminders.
      </p>
    )
  }

  const isSubscribed = state === 'subscribed'

  return (
    <button
      onClick={isSubscribed ? disable : enable}
      title={isSubscribed ? 'Disable session notifications' : 'Enable session notifications'}
      aria-label={isSubscribed ? 'Disable session notifications' : 'Enable session notifications'}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors py-1 px-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isSubscribed ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        {!isSubscribed && <line x1="1" y1="1" x2="23" y2="23" />}
      </svg>
      {isSubscribed ? 'Notifications on' : 'Get session reminders'}
    </button>
  )
}
