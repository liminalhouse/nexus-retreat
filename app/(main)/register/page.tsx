import Form from '@/app/components/Form'
import {client} from '@/sanity/lib/client'
import {registrationFormContentQuery} from '@/sanity/lib/queries'
import {buildFormConfig} from './buildFormConfig'
import {redirect} from 'next/navigation'

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
        <Form config={formConfig} showLogo={true} showProgress={true} />
      </div>
    </div>
  )
}
