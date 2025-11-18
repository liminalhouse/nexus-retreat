'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Registration = {
  id: string
  created_at: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  form_data: any
  status?: string
  notes?: string
}

export default function EditModal({
  registration,
  onClose,
}: {
  registration: Registration
  onClose: () => void
}) {
  const router = useRouter()
  const [status, setStatus] = useState(registration.status || 'pending')
  const [notes, setNotes] = useState(registration.notes || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await supabase
      .from('registrations')
      .update({ status, notes })
      .eq('id', registration.id)

    if (error) {
      alert('Error saving: ' + error.message)
    } else {
      router.refresh()
      onClose()
    }
    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Registration Details</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">
                {registration.first_name} {registration.last_name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{registration.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{registration.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submitted On
              </label>
              <p className="text-gray-900">
                {new Date(registration.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Full Form Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complete Form Data
            </label>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-64 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(registration.form_data, null, 2)}
              </pre>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
              placeholder="Add notes about this registration..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-nexus-coral text-white rounded-lg hover:bg-nexus-coral-dark disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
