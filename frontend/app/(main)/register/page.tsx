import Form from '@/app/components/Form'
import {registrationFormConfig} from './formConfig'

export default function RegisterPage() {
  return (
    <div className="py-12 px-4 bg-linear-to-t from-blue-800 to-indigo-950">
      <div className="max-w-2xl mx-auto">
        <Form config={registrationFormConfig} showLogo={true} showProgress={true} />
      </div>
    </div>
  )
}
