'use client'

import {useState} from 'react'
import {
  formatAccommodations,
  formatDinnerAttendance,
  formatActivities,
  ACCOMMODATION_OPTIONS,
  DINNER_OPTIONS,
  ACTIVITY_OPTIONS,
} from '@/lib/utils/formatRegistrationFields'

type Registration = {
  id: string
  created_at: string
  email: string
  first_name?: string
  last_name?: string
  title?: string | null
  organization?: string | null
  mobile_phone?: string
  address_line_1?: string
  address_line_2?: string | null
  city?: string
  state?: string
  zip?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_relation?: string | null
  emergency_contact_email?: string
  emergency_contact_phone?: string
  assistant_name?: string | null
  assistant_title?: string | null
  assistant_email?: string | null
  assistant_phone?: string | null
  guest_name?: string | null
  guest_relation?: string | null
  guest_email?: string | null
  dietary_restrictions?: string | null
  jacket_size?: string | null
  accommodations?: string[] | null
  dinner_attendance?: string[] | null
  activities?: string[] | null
  guest_dietary_restrictions?: string | null
  guest_jacket_size?: string | null
  guest_accommodations?: string[] | null
  guest_dinner_attendance?: string[] | null
  guest_activities?: string[] | null
}

export default function EditModal({
  registration,
  onClose,
}: {
  registration: Registration
  onClose: () => void
}) {
  const [formData, setFormData] = useState<Registration>(registration)
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement save to database
    // For now with fake data, just close the modal
    setTimeout(() => {
      setIsSaving(false)
      onClose()
    }, 500)
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Details</h3>
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
              <div className="col-span-2">
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
              </div>
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
                            e.target.checked
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
                            e.target.checked
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
              <div className="col-span-2">
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
              </div>
            </div>
          </div>

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
