'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {ChatBubbleLeftIcon} from '@heroicons/react/24/outline'

export default function ChatNavIcon() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/chat/unread-count')
        if (!res.ok) return // 401 = not logged in — render nothing
        const data = await res.json()
        setUnreadCount(data.count)
      } catch {
        // ignore
      }
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30_000)

    function handleMessagesRead(e: Event) {
      const {count} = (e as CustomEvent<{count: number}>).detail
      // Optimistic subtract for instant visual feedback
      setUnreadCount((prev) => (prev !== null ? Math.max(0, prev - count) : 0))
      // Re-fetch after a short delay so the server has time to finish marking as read
      setTimeout(fetchCount, 500)
    }

    window.addEventListener('chatMessagesRead', handleMessagesRead)
    return () => {
      clearInterval(interval)
      window.removeEventListener('chatMessagesRead', handleMessagesRead)
    }
  }, [])

  // null = not logged in or still loading
  if (unreadCount === null) return null

  return (
    <Link
      href="/chat"
      className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : 'Chat'}
    >
      <ChatBubbleLeftIcon className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold bg-red-500 text-white rounded-full leading-none">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
