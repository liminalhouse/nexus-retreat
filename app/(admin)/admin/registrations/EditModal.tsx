'use client'

import {useState} from 'react'
import Avatar from '@/app/components/Avatar'
import {
  formatAccommodations,
  formatDinnerAttendance,
  formatActivities,
  ACCOMMODATION_OPTIONS,
  DINNER_OPTIONS,
  ACTIVITY_OPTIONS,
} from '@/lib/utils/formatRegistrationFields'
import type {Registration} from '@/lib/types/registration'

export default function EditModal({
  registration,
  onClose,
  onSave,
  isAdminView = false,
}: {
  registration: Registration
  onClose: () => void
  onSave?: (updatedRegistration: Registration) => void
  isAdminView?: boolean
}) {
  const [formData, setFormData] = useState<Registration>(registration)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (field: keyof Registration, value: any) => {
    setFormData((prev) => ({...prev, [field]: value}))
  }

  const handleCheckboxChange = (field: keyof Registration, value: string, checked: boolean) => {
    setFormData((prev) => {
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
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

      // Update form data with the uploaded image URL
      handleChange('profile_picture', data.url)
      setIsUploading(false)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // If not admin view, exclude admin_notes from the update
      const dataToSend = isAdminView
        ? formData
        : {
            ...formData,
            admin_notes: undefined, // Don't send admin_notes if not admin
          }

      const response = await fetch(`/api/registration/${formData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update registration')
        setIsSaving(false)
        return
      }

      // Update the parent component's state with the new data
      if (onSave) {
        onSave(formData)
      }

      // Close the modal
      onClose()
    } catch (err) {
      console.error('Error updating registration:', err)
      setError('Failed to update registration. Please try again.')
      setIsSaving(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Edit Registration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Details</h3>

            {/* Profile Picture */}
            <div className="mb-6 flex items-center gap-6">
              <Avatar
                src={formData.profile_picture}
                firstName={formData.first_name}
                lastName={formData.last_name}
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
                  {formData.profile_picture && (
                    <button
                      onClick={() => handleChange('profile_picture', null)}
                      className="text-sm text-red-600 hover:text-red-700"
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG, PNG, or GIF</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Mobile Phone</label>
                <input
                  type="tel"
                  value={formData.mobile_phone || ''}
                  onChange={(e) => handleChange('mobile_phone', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Organization</label>
                <input
                  type="text"
                  value={formData.organization || ''}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Work Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Address Line 1</label>
                <input
                  type="text"
                  value={formData.address_line_1 || ''}
                  onChange={(e) => handleChange('address_line_1', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Address Line 2</label>
                <input
                  type="text"
                  value={formData.address_line_2 || ''}
                  onChange={(e) => handleChange('address_line_2', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Zip</label>
                <input
                  type="text"
                  value={formData.zip || ''}
                  onChange={(e) => handleChange('zip', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={formData.emergency_contact_name || ''}
                  onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Relation</label>
                <input
                  type="text"
                  value={formData.emergency_contact_relation || ''}
                  onChange={(e) => handleChange('emergency_contact_relation', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.emergency_contact_email || ''}
                  onChange={(e) => handleChange('emergency_contact_email', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={formData.emergency_contact_phone || ''}
                  onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Assistant */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Assistant</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={formData.assistant_name || ''}
                  onChange={(e) => handleChange('assistant_name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={formData.assistant_title || ''}
                  onChange={(e) => handleChange('assistant_title', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.assistant_email || ''}
                  onChange={(e) => handleChange('assistant_email', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={formData.assistant_phone || ''}
                  onChange={(e) => handleChange('assistant_phone', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={formData.guest_name || ''}
                  onChange={(e) => handleChange('guest_name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Relation</label>
                <input
                  type="text"
                  value={formData.guest_relation || ''}
                  onChange={(e) => handleChange('guest_relation', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.guest_email || ''}
                  onChange={(e) => handleChange('guest_email', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Attendee Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Dietary Restrictions</label>
                <textarea
                  value={formData.dietary_restrictions || ''}
                  onChange={(e) => handleChange('dietary_restrictions', e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div>
                <label className={labelClass}>Jacket Size</label>
                <select
                  value={formData.jacket_size || ''}
                  onChange={(e) => handleChange('jacket_size', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select size...</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Accommodations</label>
                <div className="space-y-2">
                  {ACCOMMODATION_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.accommodations || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange('accommodations', option.value, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Dinner Attendance</label>
                <div className="space-y-2">
                  {DINNER_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.dinner_attendance || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange('dinner_attendance', option.value, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* TODO: Hide activities */}
              {/* <div className="col-span-2">
                <label className={labelClass}>Activities</label>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.activities || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange('activities', option.value, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Guest Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Dietary Restrictions</label>
                <textarea
                  value={formData.guest_dietary_restrictions || ''}
                  onChange={(e) => handleChange('guest_dietary_restrictions', e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div>
                <label className={labelClass}>Jacket Size</label>
                <select
                  value={formData.guest_jacket_size || ''}
                  onChange={(e) => handleChange('guest_jacket_size', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select size...</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Guest Accommodations</label>
                <div className="space-y-2">
                  {ACCOMMODATION_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.guest_accommodations || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            'guest_accommodations',
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {option.label.replace('I will use my', 'Guest will use')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Guest Dinner Attendance</label>
                <div className="space-y-2">
                  {DINNER_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.guest_dinner_attendance || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            'guest_dinner_attendance',
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {option.label.replace('I will attend', 'Guest will attend')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* TODO: Hide activities */}
              {/* <div className="col-span-2">
                <label className={labelClass}>Guest Activities</label>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.guest_activities || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange('guest_activities', option.value, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
          {isAdminView && (
            <>
              <hr className="my-6 border-t border-gray-200 w-[800px] mx-auto" />
              {/* Admin Notes */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Admin Notes</h3>
                <div>
                  <label className={labelClass}>Internal Notes (Visible to Admins Only)</label>
                  <textarea
                    value={formData.admin_notes || ''}
                    onChange={(e) => handleChange('admin_notes', e.target.value)}
                    className={`${inputClass} bg-yellow-50`}
                    rows={4}
                    placeholder="Add any internal notes or comments about this registration..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Registration ID:</strong> {formData.id}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Submitted:</strong> {new Date(formData.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-nexus-navy text-white rounded-lg hover:bg-nexus-navy-dark disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
