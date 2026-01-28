'use client'

import {Suspense, useState, useEffect, useCallback} from 'react'
import {useSearchParams, useRouter} from 'next/navigation'
import NexusLogo from '@/app/components/NexusLogo'
import {ACTIVITY_OPTIONS, GUEST_ACTIVITY_OPTIONS} from '@/lib/utils/formatRegistrationFields'

type PageState = 'email_entry' | 'loading_lookup' | 'editing' | 'saving' | 'success'

interface RegistrationData {
  id: string
  first_name: string
  last_name: string
  guest_name: string | null
  guest_email: string | null
  activities: string[] | null
  guest_activities: string[] | null
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">Loading...</p>
      </div>
    </div>
  )
}

function decodeEmailParam(encoded: string | null): string | null {
  if (!encoded) return null
  try {
    return atob(encoded)
  } catch {
    return null
  }
}

function EditActivitiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailParam = decodeEmailParam(searchParams.get('e'))

  const [pageState, setPageState] = useState<PageState>(
    emailParam ? 'loading_lookup' : 'email_entry',
  )
  const [email, setEmail] = useState(emailParam || '')
  const [error, setError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [activities, setActivities] = useState<string[]>([])
  const [guestActivities, setGuestActivities] = useState<string[]>([])

  const hasGuest = !!(registrationData?.guest_name || registrationData?.guest_email)

  const lookupByEmail = useCallback(async (lookupEmail: string) => {
    setError(null)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(lookupEmail)) {
      setError('Please enter a valid email address.')
      setPageState('email_entry')
      return
    }

    setPageState('loading_lookup')

    try {
      const response = await fetch(`/api/registration/by-email/${encodeURIComponent(lookupEmail)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'No registration found for this email address.')
        setPageState('email_entry')
        return
      }

      setRegistrationData(data.data)
      setActivities(data.data.activities || [])
      setGuestActivities(data.data.guest_activities || [])
      setPageState('editing')

      // Update URL with email param so refresh preserves state
      const encodedEmail = btoa(lookupEmail)
      router.replace(`/edit-activities?e=${encodedEmail}`, {scroll: false})
    } catch (err) {
      console.error('Lookup error:', err)
      setError('Unable to connect. Please check your internet connection and try again.')
      setPageState('email_entry')
    }
  }, [router])

  // Auto-lookup when email param is present (runs once on mount)
  useEffect(() => {
    if (emailParam) {
      lookupByEmail(emailParam)
    }
  }, [emailParam, lookupByEmail])

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    lookupByEmail(email)
  }

  const handleActivityToggle = (value: string) => {
    setActivities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleGuestActivityToggle = (value: string) => {
    setGuestActivities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registrationData) return

    setError(null)
    setPageState('saving')

    try {
      const response = await fetch(`/api/registration/${registrationData.id}/activities`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          activities,
          guest_activities: guestActivities,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'Failed to save your changes. Please try again.')
        setPageState('editing')
        return
      }

      setPageState('success')
    } catch (err) {
      console.error('Save error:', err)
      setError('Unable to connect. Please check your internet connection and try again.')
      setPageState('editing')
    }
  }

  const handleReset = () => {
    setPageState('email_entry')
    setEmail('')
    setError(null)
    setRegistrationData(null)
    setActivities([])
    setGuestActivities([])
    // Clear URL param
    router.replace('/edit-activities', {scroll: false})
  }

  // Loading view (shown when auto-looking up from URL param)
  if (pageState === 'loading_lookup' && emailParam) {
    return <LoadingSpinner />
  }

  // Email entry view
  if (pageState === 'email_entry' || pageState === 'loading_lookup') {
    return (
      <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Edit Your Activities
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter the email you registered with to update your activity selections.
            </p>

            <form onSubmit={handleLookup}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="Your registered email address"
                  required
                  disabled={pageState === 'loading_lookup'}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 transition-all duration-300 ease-out focus:border-blue-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-100 hover:border-gray-400 disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={pageState === 'loading_lookup' || !email}
                className="w-full px-8 py-3 bg-nexus-navy-dark text-white rounded-md hover:bg-nexus-navy transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pageState === 'loading_lookup' ? 'Looking up...' : 'Look Up Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Editing view
  if (pageState === 'editing' || pageState === 'saving') {
    return (
      <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Welcome {registrationData?.first_name} {registrationData?.last_name}!
            </h1>
             <h2 className="text-md font-bold text-gray-900 mb-2 text-center">
              Which activities would you like to join for the retreat?
            </h2>
            <p className="text-gray-500 text-center mb-8 text-sm">{email}</p>

            <form onSubmit={handleSave}>
              {/* Attendee Activities */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Activities</h2>
                <p className="text-xs text-gray-500 mb-4">
                  These are optional activities available during the retreat. Please select any that
                  interest you.
                </p>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map((option, idx) => {
                    const isChecked = activities.includes(option.value)
                    const checkboxId = `activity_${idx}`

                    return (
                      <div key={idx} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id={checkboxId}
                            checked={isChecked}
                            onChange={() => handleActivityToggle(option.value)}
                            disabled={pageState === 'saving'}
                            className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
                          />
                        </div>
                        <label
                          htmlFor={checkboxId}
                          className="ml-3 text-sm text-gray-700 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Guest Activities */}
              {hasGuest && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Guest Activities
                    {registrationData?.guest_name && (
                      <span className="text-gray-500 font-normal text-sm ml-2">
                        ({registrationData.guest_name})
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    These are optional activities available during the retreat. Please select any
                    that interest your guest.
                  </p>
                  <div className="space-y-2">
                    {GUEST_ACTIVITY_OPTIONS.map((option, idx) => {
                      const isChecked = guestActivities.includes(option.value)
                      const checkboxId = `guest_activity_${idx}`

                      return (
                        <div key={idx} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              id={checkboxId}
                              checked={isChecked}
                              onChange={() => handleGuestActivityToggle(option.value)}
                              disabled={pageState === 'saving'}
                              className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
                            />
                          </div>
                          <label
                            htmlFor={checkboxId}
                            className="ml-3 text-sm text-gray-700 cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-8">
                <button
                  type="submit"
                  disabled={pageState === 'saving'}
                  className="px-8 py-3 bg-nexus-navy-dark text-white rounded-md hover:bg-nexus-navy transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pageState === 'saving' ? 'Saving...' : 'Save Activities'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Success view
  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <svg
          className="h-16 w-16 text-green-400 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Activities Updated!</h1>
        <p className="text-gray-600 mb-6">Your activity selections have been saved.</p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setPageState('editing')
              setError(null)
            }}
            className="w-full px-6 py-3 bg-nexus-navy-dark text-white rounded-lg hover:bg-nexus-navy transition-colors font-medium"
          >
            Make More Changes
          </button>
          <button
            onClick={handleReset}
            className="w-full px-6 py-3 bg-white text-nexus-navy border border-nexus-navy rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Look Up Another Registration
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EditActivitiesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditActivitiesContent />
    </Suspense>
  )
}
