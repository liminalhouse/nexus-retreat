import {requireAuth} from '@/lib/auth/requireAuth'
import {db} from '@/lib/db'
import {adminNotifications} from '@/lib/db/schema'
import {desc} from 'drizzle-orm'
import PushSendForm from './PushSendForm'

export default async function PushAdminPage() {
  await requireAuth('/admin')

  const history = await db
    .select()
    .from(adminNotifications)
    .orderBy(desc(adminNotifications.createdAt))
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-4xl font-bold mb-2">Send Notification</h1>
        <p className="text-gray-500 mb-8">
          Broadcast a message to all attendees currently using the app.
        </p>

        <PushSendForm />

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Sent History</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-400">No notifications sent yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((n) => (
                <div key={n.id} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                    <time
                      className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5"
                      dateTime={n.createdAt.toISOString()}
                    >
                      {n.createdAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
