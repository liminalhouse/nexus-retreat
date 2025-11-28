'use client'

import {useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import EditModal from '@/app/(admin)/admin/registrations/EditModal'
import type {Registration} from '@/lib/types/registration'
import Link from 'next/link'

export default function EditRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registration/by-token/${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load registration')
          setLoading(false)
          return
        }

        setRegistration(data.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching registration:', err)
        setError('Failed to load registration')
        setLoading(false)
      }
    }

    fetchRegistration()
  }, [token])

  const handleSave = (updatedRegistration: Registration) => {
    setRegistration(updatedRegistration)
    setSaved(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your registration...</p>
        </div>
      </div>
    )
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This edit link is invalid or has expired.'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-nexus-navy text-white rounded-lg hover:bg-nexus-navy-dark"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Changes Saved!</h1>
          <p className="text-gray-600 mb-6">Your registration has been updated successfully.</p>
          <button
            onClick={() => setSaved(false)}
            className="inline-block px-6 py-3 bg-nexus-navy text-white rounded-lg hover:bg-nexus-navy-dark"
          >
            Continue Editing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EditModal
        registration={registration}
        onClose={() => router.push('/')}
        onSave={handleSave}
        isAdminView={false}
      />
    </div>
  )
}
