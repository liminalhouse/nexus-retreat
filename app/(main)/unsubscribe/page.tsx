'use client'

import {useState} from 'react'
import {Metadata} from 'next'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-[#faf5f1]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#3d4663] mb-2">
            Unsubscribe
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email address to unsubscribe from future Nexus Retreat emails.
          </p>

          {status === 'success' ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-green-800 text-sm font-medium">
                You have been successfully unsubscribed.
              </p>
              <p className="text-green-700 text-xs mt-1">
                You will no longer receive emails from Nexus Retreat.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d4663] focus:border-transparent"
                />
              </div>

              {status === 'error' && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 px-4 bg-[#3d4663] text-white text-sm font-semibold rounded-lg hover:bg-[#1c2544] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Contact us at{' '}
          <a href="mailto:info@nexus-retreat.com" className="text-[#f49898] hover:underline">
            info@nexus-retreat.com
          </a>
        </p>
      </div>
    </div>
  )
}
