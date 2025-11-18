import {sanityFetch} from '@/sanity/lib/live'
import {registrationFormQuery} from '@/sanity/lib/queries'
import RegistrationForm from './RegistrationForm'

export default async function RegisterPage() {
  const {data: formConfig} = await sanityFetch({
    query: registrationFormQuery,
  })

  if (!formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Unavailable</h1>
          <p className="text-gray-600">
            The registration form is not configured. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  return <RegistrationForm config={formConfig} />
}
