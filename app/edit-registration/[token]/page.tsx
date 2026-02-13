'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import Link from 'next/link'
import NexusLogo from '@/app/components/NexusLogo'
import Avatar from '@/app/components/Avatar'
import {
  ACCOMMODATION_OPTIONS,
  DINNER_OPTIONS,
  ACTIVITY_OPTIONS,
} from '@/lib/utils/formatRegistrationFields'
import {JACKET_SIZE_OPTIONS} from '@/app/(main)/register/formConfig'
import type {Registration} from '@/lib/types/registration'

type PageState = 'loading' | 'editing' | 'saving' | 'success' | 'error'

export default function EditRegistrationPage() {
  const params = useParams()
  const token = params.token as string

  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Registration | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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

        setFormData(data.data)
        setPageState('editing')
      } catch (err) {
        console.error('Error fetching registration:', err)
        setError('Failed to load registration')
        setPageState('error')
      }
    }

    fetchRegistration()
  }, [token])

  const handleChange = (field: keyof Registration, value: string | string[] | null) => {
    setFormData((prev) => (prev ? {...prev, [field]: value} : null))
  }

  const handleCheckboxChange = (field: keyof Registration, value: string, checked: boolean) => {
    setFormData((prev) => {
      if (!prev) return null
      const currentValues = (prev[field] as string[]) || []
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value)
      return {...prev, [field]: newValues}
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to upload image')
        setIsUploading(false)
        return
      }

      handleChange('profile_picture', data.url)
      setIsUploading(false)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image')
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setError(null)
    setPageState('saving')

    try {
      const response = await fetch(`/api/registration/${formData.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'Failed to save changes')
        setPageState('editing')
        return
      }

      setPageState('success')
    } catch (err) {
      console.error('Save error:', err)
      setError('Unable to connect. Please try again.')
      setPageState('editing')
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-navy focus:border-nexus-navy'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading your registration...</p>
        </div>
      </div>
    )
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

  if (pageState === 'success') {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Changes Saved!</h1>
          <p className="text-gray-600 mb-6">Your registration has been updated successfully.</p>
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
              href={`/edit-registration/${token}/activities`}
              className="block w-full px-6 py-3 bg-white text-nexus-navy border border-nexus-navy rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Edit Activities Only
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Editing view
  return (
    <div className="min-h-screen bg-linear-to-t from-blue-800 to-indigo-950 py-12 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <NexusLogo color="#000" className="w-[168px] my-6 mx-auto" />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Edit Your Registration
          </h1>
          <p className="text-gray-600 text-center mb-8 text-sm">
            Hi {formData?.first_name}, update your information below. Contact{' '}
            <a href="mailto:info@nexus-retreat.com" className="underline text-nexus-navy">
              info@nexus-retreat.com
            </a>{' '}
            if you need help.
          </p>

          <form onSubmit={handleSave} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <Avatar
                src={formData?.profile_picture}
                firstName={formData?.first_name || ''}
                lastName={formData?.last_name || ''}
                size="lg"
              />
              <div className="flex-1">
                <label className={labelClass}>Profile Picture</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700">
                    {isUploading ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {formData?.profile_picture && (
                    <button
                      type="button"
                      onClick={() => handleChange('profile_picture', null)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    value={formData?.first_name || ''}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    value={formData?.last_name || ''}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={formData?.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Mobile Phone</label>
                  <input
                    type="tel"
                    value={formData?.mobile_phone || ''}
                    onChange={(e) => handleChange('mobile_phone', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={formData?.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Organization</label>
                  <input
                    type="text"
                    value={formData?.organization || ''}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 1</label>
                  <input
                    type="text"
                    value={formData?.address_line_1 || ''}
                    onChange={(e) => handleChange('address_line_1', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 2</label>
                  <input
                    type="text"
                    value={formData?.address_line_2 || ''}
                    onChange={(e) => handleChange('address_line_2', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={formData?.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    type="text"
                    value={formData?.state || ''}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Zip</label>
                  <input
                    type="text"
                    value={formData?.zip || ''}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    value={formData?.country || ''}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={formData?.emergency_contact_name || ''}
                    onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Relation</label>
                  <input
                    type="text"
                    value={formData?.emergency_contact_relation || ''}
                    onChange={(e) => handleChange('emergency_contact_relation', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={formData?.emergency_contact_email || ''}
                    onChange={(e) => handleChange('emergency_contact_email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={formData?.emergency_contact_phone || ''}
                    onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Executive Assistant */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Executive Assistant</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={formData?.assistant_name || ''}
                    onChange={(e) => handleChange('assistant_name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={formData?.assistant_title || ''}
                    onChange={(e) => handleChange('assistant_title', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={formData?.assistant_email || ''}
                    onChange={(e) => handleChange('assistant_email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={formData?.assistant_phone || ''}
                    onChange={(e) => handleChange('assistant_phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Guest Name</label>
                  <input
                    type="text"
                    value={formData?.guest_name || ''}
                    onChange={(e) => handleChange('guest_name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Relation</label>
                  <input
                    type="text"
                    value={formData?.guest_relation || ''}
                    onChange={(e) => handleChange('guest_relation', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Guest Email</label>
                  <input
                    type="email"
                    value={formData?.guest_email || ''}
                    onChange={(e) => handleChange('guest_email', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Dietary Restrictions</label>
                  <textarea
                    value={formData?.dietary_restrictions || ''}
                    onChange={(e) => handleChange('dietary_restrictions', e.target.value)}
                    className={inputClass}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jacket Size</label>
                    <select
                      value={formData?.jacket_size || ''}
                      onChange={(e) => handleChange('jacket_size', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select size...</option>
                      {JACKET_SIZE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Accommodations</label>
                  <div className="space-y-2 mt-2">
                    {ACCOMMODATION_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData?.accommodations || []).includes(option.value)}
                          onChange={(e) =>
                            handleCheckboxChange('accommodations', option.value, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Dinner Attendance</label>
                  <div className="space-y-2 mt-2">
                    {DINNER_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData?.dinner_attendance || []).includes(option.value)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              'dinner_attendance',
                              option.value,
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Activities</label>
                  <div className="space-y-3 mt-2">
                    {ACTIVITY_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={(formData?.activities || []).includes(option.value)}
                          onChange={(e) =>
                            handleCheckboxChange('activities', option.value, e.target.checked)
                          }
                          className="h-4 w-4 mt-0.5 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                        />
                        <span className="ml-2">
                          <span className="text-sm font-medium text-gray-700">{option.label}</span>
                          {option.description && (
                            <span className="block text-xs text-gray-500">
                              {option.description}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Event Details */}
            {(formData?.guest_name || formData?.guest_email) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Event Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Guest Dietary Restrictions</label>
                    <textarea
                      value={formData?.guest_dietary_restrictions || ''}
                      onChange={(e) => handleChange('guest_dietary_restrictions', e.target.value)}
                      className={inputClass}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Guest Jacket Size</label>
                      <select
                        value={formData?.guest_jacket_size || ''}
                        onChange={(e) => handleChange('guest_jacket_size', e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select size...</option>
                        {JACKET_SIZE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Guest Accommodations</label>
                    <div className="space-y-2 mt-2">
                      {ACCOMMODATION_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData?.guest_accommodations || []).includes(option.value)}
                            onChange={(e) =>
                              handleCheckboxChange(
                                'guest_accommodations',
                                option.value,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.label.replace('I will use my', 'Guest will use')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Guest Dinner Attendance</label>
                    <div className="space-y-2 mt-2">
                      {DINNER_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData?.guest_dinner_attendance || []).includes(
                              option.value,
                            )}
                            onChange={(e) =>
                              handleCheckboxChange(
                                'guest_dinner_attendance',
                                option.value,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.label.replace('I will attend', 'Guest will attend')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Guest Activities</label>
                    <div className="space-y-3 mt-2">
                      {ACTIVITY_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={(formData?.guest_activities || []).includes(option.value)}
                            onChange={(e) =>
                              handleCheckboxChange(
                                'guest_activities',
                                option.value,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 mt-0.5 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                          />
                          <span className="ml-2">
                            <span className="text-sm font-medium text-gray-700">
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="block text-xs text-gray-500">
                                {option.description}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end items-center pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={pageState === 'saving'}
                className="px-8 py-3 bg-nexus-navy-dark text-white rounded-lg hover:bg-nexus-navy transition-colors font-medium disabled:opacity-50"
              >
                {pageState === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
