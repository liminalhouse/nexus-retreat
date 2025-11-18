'use client'

import Link from 'next/link'
import Form from '@/app/components/Form'
import type {RegistrationFormConfig} from '@/app/components/Form/types'

interface RegistrationFormProps {
  config: RegistrationFormConfig
}

export default function RegistrationForm({config}: RegistrationFormProps) {
  return (
    <div className="min-h-screen bg-nexus-navy-dark py-8 px-4">
      {/* Back to Home Link */}
      <div className="w-full max-w-2xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-white hover:text-gray-200 text-sm transition-colors"
        >
          ← {config.backToHomeText || 'BACK TO HOME'}
        </Link>
      </div>

      {/* Event Date Display */}
      {config.eventDate && (
        <div className="w-full max-w-2xl mx-auto text-center mb-4">
          <p className="text-white">{config.eventDate}</p>
        </div>
      )}

      {/* Form Component */}
      <Form config={config} showLogo={true} showProgress={true} />
    </div>
  )
}
