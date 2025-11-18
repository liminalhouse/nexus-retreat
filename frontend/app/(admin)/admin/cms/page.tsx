'use client'

import { useEffect } from 'react'

export default function AdminCMS() {
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

  useEffect(() => {
    // Automatically redirect to Sanity Studio
    window.location.href = studioUrl
  }, [studioUrl])

  return (
    <div className="mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Redirecting to Sanity Studio...</h2>
        <p className="text-gray-600 mb-6">
          You'll be redirected to the Sanity CMS in a moment.
        </p>
        <a
          href={studioUrl}
          className="inline-block px-6 py-3 bg-nexus-coral text-white rounded-lg hover:bg-nexus-coral-dark"
        >
          Click here if you're not redirected
        </a>
      </div>
    </div>
  )
}
