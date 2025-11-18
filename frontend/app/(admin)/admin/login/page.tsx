'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminSignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  // Handle OAuth callback
  useEffect(() => {
    // Sanity OAuth can return params in either hash or query string
    const hash = window.location.hash
    const search = window.location.search
    const searchParams = new URLSearchParams(search)

    // Check for session ID (sid) in query params - this is what Sanity returns
    const sid = searchParams.get('sid')
    const fetchUrl = searchParams.get('url')

    console.log('OAuth callback received:', { sid, fetchUrl, hash, search })

    if (sid && fetchUrl) {
      // Show loading immediately when we detect OAuth callback
      setLoading(true)
      // Sanity's OAuth flow: fetch token from the provided URL
      handleSanitySessionCallback(fetchUrl)
      return
    }

    // Fallback: check for access_token in hash (older flow)
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const error = params.get('error')
      const errorDescription = params.get('error_description')

      console.log('Hash callback:', { hasToken: !!accessToken, error, errorDescription })

      if (error) {
        setError(errorDescription || error || 'Authentication failed')
        window.history.replaceState(null, '', window.location.pathname)
        return
      }

      if (accessToken) {
        setLoading(true)
        handleOAuthCallback(accessToken)
      }
    }
  }, [])

  const handleSanitySessionCallback = async (fetchUrl: string) => {
    console.log('Fetching Sanity session token from:', fetchUrl)

    try {
      // Fetch the token from Sanity's fetch URL
      const tokenResponse = await fetch(fetchUrl, {
        credentials: 'include'
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch session token')
      }

      const tokenData = await tokenResponse.json()
      console.log('Sanity session response:', tokenData)

      const token = tokenData.token || tokenData.access_token

      if (!token) {
        throw new Error('No token in response')
      }

      // Now verify with our backend (this will set loading state)
      await handleOAuthCallback(token)
    } catch (err) {
      console.error('Session callback error:', err)
      setError('Failed to complete authentication. Please try again.')
      setLoading(false)
    }
  }

  const handleOAuthCallback = async (token: string) => {
    setLoading(true)
    console.log('Verifying token with backend...')

    try {
      const response = await fetch('/api/auth/sanity/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      console.log('Backend response:', { ok: response.ok, status: response.status, data })

      if (response.ok) {
        console.log('Login successful, redirecting to:', from)
        // Use window.location for hard navigation to ensure cookies are sent
        // This is more reliable than router.push() for authentication redirects
        window.location.href = from
      } else {
        setError(data.error || 'Authentication failed')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setError('')
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const redirectUri = `${window.location.origin}/admin/login`

    if (!projectId) {
      setError('Sanity project ID is not configured')
      return
    }

    const oauthUrl = `https://api.sanity.io/v2021-06-07/auth/login/google?origin=${encodeURIComponent(redirectUri)}&projectId=${projectId}&type=token`
    console.log('Redirecting to Sanity OAuth:', oauthUrl)

    // Redirect to Sanity OAuth (page will unload, so no need for loading state)
    window.location.href = oauthUrl
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm">
              Sign in with your Google account to access the admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 text-red-600 text-sm bg-red-50 py-3 px-4 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-nexus-coral focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to main site
            </a>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> You must have access to the Sanity project to sign in.
            If you don't have access, contact your project administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
