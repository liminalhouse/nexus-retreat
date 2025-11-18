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
      const response = await fetch(config.submitEndpoint || '/api/form-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        window.scrollTo({top: 0, behavior: 'smooth'})
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Form submission failed:', errorData)
        alert('There was an error submitting your form. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('There was an error submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg p-8 md:p-12">
        {showLogo && (
          <div className="text-center mb-8">
            <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          </div>
        )}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
          <p className="text-gray-600 mb-8">{config.successMessage}</p>
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
