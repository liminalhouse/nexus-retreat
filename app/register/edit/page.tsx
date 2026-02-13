'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import NexusLogo from '@/app/components/NexusLogo'

export default function EditRegistrationLookupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/registration/by-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email.trim()}),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'No registration found with this email')
        setIsLoading(false)
        return
      }

      // Redirect to the token-based full registration editor
      router.push(`/edit-registration/${data.data.editToken}`)
    } catch {
      setError('Unable to connect. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <NexusLogo color="#000" className="w-[168px] my-6 mx-auto" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
          Edit Your Registration
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Enter the email address you used to register.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-navy focus:border-nexus-navy transition-colors disabled:bg-gray-50"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-nexus-navy-dark text-white rounded-lg hover:bg-nexus-navy transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Looking up...' : 'Continue'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Need help? Contact{' '}
          <a href="mailto:info@nexus-retreat.com" className="text-nexus-navy underline">
            info@nexus-retreat.com
          </a>
        </p>
      </div>
    </div>
  )
}
