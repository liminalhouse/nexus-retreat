import {requireAuth} from '@/lib/auth/requireAuth'
import PushSendForm from './PushSendForm'

export default async function PushAdminPage() {
  await requireAuth('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-4xl font-bold mb-2">Send Notification</h1>
        <p className="text-gray-500 mb-8">
          Broadcast a message to all attendees currently using the app.
        </p>
        <PushSendForm />
      </div>
    </div>
  )
}
