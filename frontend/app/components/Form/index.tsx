'use client'

import {useState} from 'react'
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

  // Convert the 3 hardcoded steps into an array
  const steps = [
    config.formBuilder?.step1,
    config.formBuilder?.step2,
    config.formBuilder?.step3,
  ].filter(Boolean)
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

        {config.title && <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{config.title}</h1>}
        {config.description && <p className="text-gray-600 text-center mb-6">{config.description}</p>}

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
          <div className="flex justify-between mb-8">
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
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {totalSteps > 1 ? (
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
                disabled={isSubmitting}
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
