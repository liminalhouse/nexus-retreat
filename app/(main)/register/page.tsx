import Form from '@/app/components/Form'
import {client} from '@/sanity/lib/client'
import {registrationFormContentQuery, settingsQuery} from '@/sanity/lib/queries'
import {buildFormConfig} from './buildFormConfig'
import Link from 'next/link'
import {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: 'Register | Nexus Retreat',
    },
    description: 'Register for the invitation-only gathering for international sports leaders.',
  } satisfies Metadata
}

type Props = {
  searchParams: Promise<{bypass?: string}>
}

export default async function RegisterPage({searchParams}: Props) {
  const {bypass} = await searchParams

  if (bypass !== 'true') {
    return (
      <div className="py-12 px-4 bg-linear-to-t from-blue-800 to-indigo-950 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Registration is now closed for the retreat
            </h1>
            <p className="text-nexus-navy text-lg">
              Please contact{' '}
              <a href="mailto:info@nexus-retreat.com" className="underline hover:text-gray-200">
                info@nexus-retreat.com
              </a>{' '}
              for further assistance.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch registration form content from Sanity
  const sanityContent = await client.fetch(registrationFormContentQuery)

  // Build the complete form config by merging Sanity content with base config
  const formConfig = buildFormConfig(sanityContent)

  return (
    <div className="py-12 px-4 bg-linear-to-t from-blue-800 to-indigo-950">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
        <Form config={formConfig} showLogo={true} showProgress={true} />
      </div>
    </div>
  )
}
