'use client'

import {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import NexusLogo from '@/app/components/NexusLogo'

export default function SignInPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password}),
      })

      if (response.ok) {
        window.location.href = from
      } else {
        setError('Invalid password. Please check your invitation email.')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 max-w-[400px] mx-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          <p className="text-gray-600 text-sm">
            This event is invitation-only. To access the website, please enter the password provided
            in your invitation email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || password.trim() === ''}
            className="w-full bg-nexus-navy-dark text-white py-3 px-4 rounded-md hover:bg-nexus-navy focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm cursor-pointer transition-all transition-normal"
          >
            {loading ? 'Signing in...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
