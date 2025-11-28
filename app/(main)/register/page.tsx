import Form from '@/app/components/Form'
import {client} from '@/sanity/lib/client'
import {registrationFormContentQuery} from '@/sanity/lib/queries'
import {buildFormConfig} from './buildFormConfig'
import {redirect} from 'next/navigation'
import Link from 'next/link'

export default async function RegisterPage() {
  // TODO: Remove
  if (process.env.VERCEL_ENV === 'production') {
    redirect('/') // Redirect to homepage in production
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
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
