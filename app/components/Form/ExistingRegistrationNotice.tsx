import {ExclamationCircleIcon} from '@heroicons/react/24/outline'

export default function ExistingRegistrationNotice({
  editToken,
  className = '',
}: {
  editToken: string
  className?: string
}) {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <p className="text-sm text-red-800 flex items-center">
        <ExclamationCircleIcon className="inline h-5 w-5 mr-1 flex-shrink-0" />
        This email is already registered. You can&nbsp;
        <a
          href={`/edit-registration/${editToken}`}
          className="font-semibold underline hover:text-red-900"
        >
          update your existing registration here
        </a>
        .
      </p>
    </div>
  )
}
