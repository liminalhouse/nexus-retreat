'use client'

import {useState, useEffect} from 'react'
import {useParams} from 'next/navigation'
import Link from 'next/link'
import NexusLogo from '@/app/components/NexusLogo'
import {
  ACTIVITY_OPTIONS,
  GUEST_ACTIVITY_OPTIONS,
  type ActivityOption,
} from '@/lib/utils/formatRegistrationFields'

type PageState = 'loading' | 'editing' | 'saving' | 'success' | 'error'

interface RegistrationData {
  id: string
  email: string
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

function ActivityCheckboxList({
  options,
  selectedValues,
  onToggle,
  disabled,
  idPrefix,
}: {
  options: ActivityOption[]
  selectedValues: string[]
  onToggle: (value: string) => void
  disabled: boolean
  idPrefix: string
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value)
        const checkboxId = `${idPrefix}_${option.value}`

        return (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id={checkboxId}
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                disabled={disabled}
                className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
              />
            </div>
            <label htmlFor={checkboxId} className="ml-3 cursor-pointer flex flex-col gap-1">
              <span className="text-sm text-slate-700 font-semibold">{option.label}</span>
              {option.description && (
                <span className="block text-xs font-medium text-slate-500 max-w-md">
                  {option.description}
                </span>
              )}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default function EditActivitiesPage() {
  const params = useParams()
  const token = params.token as string

  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [activities, setActivities] = useState<string[]>([])
  const [guestActivities, setGuestActivities] = useState<string[]>([])

  const hasGuest = !!(registrationData?.guest_name || registrationData?.guest_email)

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registration/by-token/${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid or expired link')
          setPageState('error')
          return
        }

        setRegistrationData(data.data)
        setActivities(data.data.activities || [])
        setGuestActivities(data.data.guest_activities || [])
        setPageState('editing')
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Unable to load registration. Please try again.')
        setPageState('error')
      }
    }

    fetchRegistration()
  }, [token])

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
      const response = await fetch(`/api/registration/by-token/${token}/activities`, {
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

  if (pageState === 'loading') {
    return <LoadingSpinner />
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
          <svg
            className="h-16 w-16 text-red-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load</h1>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    )
  }

  if (pageState === 'editing' || pageState === 'saving') {
    return (
      <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center py-24">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <NexusLogo color="#000" className="w-[168px] my-6 mx-auto" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Hi {registrationData?.first_name} {registrationData?.last_name}, which activities
              would you like to join for the retreat?
            </h1>
            <p className="text-nexus-navy text-center mb-8 text-xs">
              Please contact us at{' '}
              <a href="mailto:info@nexus-retreat.com" className="underline">
                info@nexus-retreat.com
              </a>{' '}
              if you have any questions or need assistance.
            </p>

            <form onSubmit={handleSave}>
              {/* Attendee Activities */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Activities</h2>
                <p className="text-xs text-gray-500 mb-4">
                  These are optional activities available during the retreat. Please select any that
                  interest you.
                </p>
                <ActivityCheckboxList
                  options={ACTIVITY_OPTIONS}
                  selectedValues={activities}
                  onToggle={handleActivityToggle}
                  disabled={pageState === 'saving'}
                  idPrefix="activity"
                />
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
                  <ActivityCheckboxList
                    options={GUEST_ACTIVITY_OPTIONS}
                    selectedValues={guestActivities}
                    onToggle={handleGuestActivityToggle}
                    disabled={pageState === 'saving'}
                    idPrefix="guest_activity"
                  />
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-14">
                <div>
                  <Link
                    href={`/edit-registration/${token}`}
                    className="block w-full px-6 py-3 bg-white text-nexus-navy border border-nexus-navy rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                  >
                    Edit your full registration
                  </Link>
                </div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h1>
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
          <Link
            href={`/edit-registration/${token}`}
            className="block w-full px-6 py-3 bg-white text-nexus-navy border border-nexus-navy rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Edit your full registration
          </Link>
        </div>
      </div>
    </div>
  )
}
