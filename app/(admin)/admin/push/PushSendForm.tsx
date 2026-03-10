'use client'

import {useState} from 'react'

export default function PushSendForm() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function send() {
    if (!title.trim() || !message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/admin/push', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, message}),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setTitle('')
      setMessage('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Dinner is served"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nexus-coral"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Please make your way to the main dining hall."
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nexus-coral resize-none"
        />
      </div>

      <button
        onClick={send}
        disabled={!title.trim() || !message.trim() || status === 'sending'}
        className="w-full bg-nexus-coral text-white font-semibold py-2 px-4 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Send to all active attendees'}
      </button>

      {status === 'sent' && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          Notification sent. Attendees will see it within 30 seconds.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          Failed to send. Please try again.
        </p>
      )}

      <p className="text-xs text-gray-400">
        Notifications appear as a toast for attendees who have the app open.
      </p>
    </div>
  )
}
