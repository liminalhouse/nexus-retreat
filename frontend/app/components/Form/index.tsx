'use client'

import {useState, useEffect} from 'react'
import NexusLogo from '@/app/components/NexusLogo'
import FormStepRenderer from './FormStepRenderer'
import type {FormConfig} from './types'

interface FormProps {
  config: FormConfig
  showLogo?: boolean
  showProgress?: boolean
}

export default function Form({config, showLogo = true, showProgress = true}: FormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [allStepErrors, setAllStepErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  // Get the number of steps from config (default to 1)
  const numberOfSteps = config.numberOfSteps || 1

  // Convert the steps into an array based on numberOfSteps
  const allSteps = [config.step1, config.step2, config.step3]
  const steps = allSteps.slice(0, numberOfSteps).filter(Boolean)
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const validateAllSteps = () => {
    const errors: Record<string, string> = {}

    steps.forEach((stepConfig, stepIndex) => {
      stepConfig?.fieldGroups?.forEach((group) => {
        // Check if group should be shown
        const shouldShow =
          !group?.showIfFieldHasValue ||
          (Array.isArray(group.showIfFieldHasValue)
            ? group.showIfFieldHasValue.some((fieldName) => {
                const value = formData[fieldName]
                return value !== undefined && value !== null && value !== ''
              })
            : formData[group.showIfFieldHasValue])

        if (!shouldShow) return

        group?.fields?.forEach((field) => {
          const fieldName = field?.name || ''
          const value = formData[fieldName]
          const isEmpty = value === undefined || value === null || value === ''

          if (field?.required && isEmpty) {
            errors[fieldName] = `${field.label || fieldName} is required`
          } else if (!isEmpty && value) {
            // Validate email format
            if (field?.fieldType === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (!emailRegex.test(value)) {
                errors[fieldName] = 'Please enter a valid email address'
              }
            }
            // Validate phone format (allows various formats)
            if (field?.fieldType === 'tel') {
              const phoneRegex = /^[\d\s\-\(\)\+\.]+$/
              if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                errors[fieldName] = 'Please enter a valid phone number'
              }
            }
          }
        })
      })
    })

    return errors
  }

  const validateField = (fieldName: string) => {
    // Find the field config across all steps
    let fieldConfig = null
    let shouldShow = true

    for (const step of steps) {
      for (const group of step?.fieldGroups || []) {
        // Check if group should be shown
        shouldShow =
          !group?.showIfFieldHasValue ||
          (Array.isArray(group.showIfFieldHasValue)
            ? group.showIfFieldHasValue.some((fn) => {
                const value = formData[fn]
                return value !== undefined && value !== null && value !== ''
              })
            : formData[group.showIfFieldHasValue])

        if (!shouldShow) continue

        const field = group?.fields?.find((f) => f?.name === fieldName)
        if (field) {
          fieldConfig = field
          break
        }
      }
      if (fieldConfig) break
    }

    if (!fieldConfig || !shouldShow) return null

    const value = formData[fieldName]
    const isEmpty = value === undefined || value === null || value === ''

    if (fieldConfig.required && isEmpty) {
      return `${fieldConfig.label || fieldName} is required`
    }

    // Validate format for non-empty values
    if (!isEmpty && value) {
      // Email validation
      if (fieldConfig.fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
      }
      // Phone validation
      if (fieldConfig.fieldType === 'tel') {
        const phoneRegex = /^[\d\s\-\(\)\+\.]+$/
        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
          return 'Please enter a valid phone number'
        }
      }
    }

    return null
  }

  // Validate all steps whenever we're on the last step
  useEffect(() => {
    if (currentStep === totalSteps - 1) {
      const errors = validateAllSteps()
      setAllStepErrors(errors)
      setFieldErrors(errors)
    }
  }, [currentStep, totalSteps])

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()

    // Validate all steps when moving to last step
    const isMovingToLastStep = currentStep === totalSteps - 2

    if (isMovingToLastStep) {
      const errors = validateAllSteps()
      setAllStepErrors(errors)
      setFieldErrors(errors)
    }

    // Allow progression to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear server error when user starts typing
    if (serverError) {
      setServerError(null)
    }

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }

    // Clear from all step errors too
    if (allStepErrors[name]) {
      setAllStepErrors((prev) => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFieldBlur = (name: string) => {
    setTouchedFields((prev) => ({...prev, [name]: true}))

    const error = validateField(name)
    if (error) {
      setFieldErrors((prev) => ({...prev, [name]: error}))
    } else {
      setFieldErrors((prev) => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous server errors
    setServerError(null)

    // Prevent submission if there are validation errors
    if (Object.keys(allStepErrors).length > 0) {
      return
    }

    // Prevent submission if not on last step
    if (currentStep !== totalSteps - 1) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to database first
      const response = await fetch(config.submitEndpoint || '/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Form submission failed:', errorData)

        // Display specific error message from the server
        const errorMessage =
          errorData.error ||
          errorData.details ||
          'There was an error submitting your registration. Please try again.'
        setServerError(errorMessage)

        setIsSubmitting(false)
        window.scrollTo({top: 0, behavior: 'smooth'})
        return
      }

      // If database submission successful, send confirmation email
      try {
        console.log('Sending confirmation email...')
        const emailResponse = await fetch('/api/send-registration-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const emailResult = await emailResponse.json()
        console.log('Email API response:', emailResult)

        if (!emailResponse.ok) {
          console.error('Email API error:', emailResult)
          // Email failed but registration succeeded - show warning
          console.warn('Registration saved but confirmation email failed to send')
        } else {
          console.log('Email sent successfully')
        }
      } catch (error) {
        console.error('Failed to send confirmation email:', error)
        // Don't block submission if email fails - registration was successful
      }

      // Mark as submitted
      setIsSubmitted(true)
      window.scrollTo({top: 0, behavior: 'smooth'})
    } catch (error) {
      console.error('Form submission error:', error)
      alert('There was an error submitting your registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg p-8 md:p-12">
        {showLogo && (
          <div className="text-center mb-8">
            <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          </div>
        )}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Confirmed!</h2>
          <p className="text-gray-600">{config.successMessage}</p>
        </div>

        {/* Registration Summary */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Registration Details</h3>

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.first_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.last_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{formData.email || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.mobile_phone || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Title:</span>
                  <span className="text-sm font-medium text-gray-900">{formData.title || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Organization:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.organization || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Address</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Street:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.address_line_1
                      ? `${formData.address_line_1}${formData.address_line_2 ? `, ${formData.address_line_2}` : ''}`
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">City:</span>
                  <span className="text-sm font-medium text-gray-900">{formData.city || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">State:</span>
                  <span className="text-sm font-medium text-gray-900">{formData.state || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Zip Code:</span>
                  <span className="text-sm font-medium text-gray-900">{formData.zip || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Country:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.country || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.emergency_contact_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Relation:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.emergency_contact_relation || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.emergency_contact_phone || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.emergency_contact_email || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Assistant */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Executive Assistant</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.assistant_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Title:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.assistant_title || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.assistant_email || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.assistant_phone || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Guest Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Guest Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.guest_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Relation:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.guest_relation || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Guest Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.guest_email || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Event Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dietary Restrictions:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.dietary_restrictions || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jacket Size:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.jacket_size || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Accommodations:</span>
                  {formData.accommodations && formData.accommodations.length > 0 ? (
                    <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                      {formData.accommodations.map((acc: string, idx: number) => (
                        <li key={idx}>{acc.replace('_', ' ')}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">-</span>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Dinner Attendance:</span>
                  {formData.dinner_attendance && formData.dinner_attendance.length > 0 ? (
                    <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                      {formData.dinner_attendance.map((dinner: string, idx: number) => (
                        <li key={idx}>{dinner.replace('_', ' ')}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">-</span>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Activities:</span>
                  {formData.activities && formData.activities.length > 0 ? (
                    <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                      {formData.activities.map((activity: string, idx: number) => (
                        <li key={idx}>{activity.replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Guest Event Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Guest Event Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Guest Dietary Restrictions:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.guest_dietary_restrictions || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Guest Jacket Size:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.guest_jacket_size || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Guest Accommodations:</span>
                  {formData.guest_accommodations && formData.guest_accommodations.length > 0 ? (
                    <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                      {formData.guest_accommodations.map((acc: string, idx: number) => (
                        <li key={idx}>{acc.replace('_', ' ')}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">-</span>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Guest Dinner Attendance:</span>
                  {formData.guest_dinner_attendance &&
                  formData.guest_dinner_attendance.length > 0 ? (
                    <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                      {formData.guest_dinner_attendance.map((dinner: string, idx: number) => (
                        <li key={idx}>{dinner.replace('_', ' ')}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">-</span>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Guest Activities:</span>
                  {formData.guest_activities && formData.guest_activities.length > 0 ? (
                    <ul className="text-sm font-medium text-gray-900 list-disc list-inside">
                      {formData.guest_activities.map((activity: string, idx: number) => (
                        <li key={idx}>{activity.replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
      <div className="p-6 md:p-8">
        {/* Logo and Title */}
        {showLogo && (
          <div className="text-center mb-8">
            <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
            {config.subtitle && (
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {config.title && (
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{config.title}</h1>
        )}
        {config.description && (
          <p className="text-gray-600 text-center mb-6">{config.description}</p>
        )}

        {/* Progress Bar */}
        {showProgress && totalSteps > 1 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress: {Math.round(progress)}%</span>
              <span className="text-sm text-gray-600">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-nexus-navy h-2 rounded-full transition-all duration-300"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>
        )}

        {/* Step Indicators */}
        {totalSteps > 1 && (
          <div className="flex justify-between mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index < currentStep
                      ? 'bg-nexus-navy text-white'
                      : index === currentStep
                        ? 'bg-nexus-navy text-white ring-4 ring-blue-100'
                        : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <p className="text-xs text-center mt-2 text-gray-600 hidden md:block">
                  {step?.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Server Error Message */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
                  <h3 className="text-sm font-semibold text-red-800">{serverError}</h3>
                </div>
              </div>
            </div>
          )}

          {steps[currentStep] && (
            <FormStepRenderer
              step={steps[currentStep]}
              formData={formData}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
              fieldErrors={fieldErrors}
            />
          )}

          {/* Validation Summary - Only show on last step */}
          {currentStep === totalSteps - 1 && Object.keys(allStepErrors).length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Please complete the following required fields:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(allStepErrors).map(([fieldName, error]) => (
                  <li key={fieldName} className="text-sm text-red-700">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {totalSteps > 1 && currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-nexus-navy border border-nexus-navy hover:bg-gray-50'
                }`}
              >
                {config.backButtonText || 'BACK'}
              </button>
            ) : (
              <div></div>
            )}

            {currentStep === totalSteps - 1 ? (
              <button
                type="submit"
                disabled={isSubmitting || Object.keys(allStepErrors).length > 0}
                className="px-8 py-3 bg-nexus-navy-dark text-white rounded-md hover:bg-nexus-navy transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : config.submitButtonText || 'SUBMIT'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-nexus-navy-dark text-white rounded-md hover:bg-nexus-navy transition-all font-medium"
              >
                {config.nextButtonText || 'NEXT'} →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
