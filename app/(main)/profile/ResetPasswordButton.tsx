'use client'

import {useState} from 'react'

export default function ResetPasswordButton({email}: {email: string}) {
  const [modal, setModal] = useState(false)
  const [state, setState] = useState<'idle' | 'loading' | 'sent'>('idle')

  async function handleReset() {
    setState('loading')
    try {
      await fetch('/api/chat/forgot-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })
    } catch {
      // ignore — endpoint always returns success to avoid leaking emails
    }
    setState('sent')
    setModal(false)
  }

  return (
    <>
      {state === 'sent' ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          Password reset email sent — check your inbox.
        </p>
      ) : (
        <button
          onClick={() => setModal(true)}
          className="text-xs text-red-700 hover:text-red-600 hover:underline underline-offset-2"
        >
          Reset password
        </button>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Are you sure you want to reset your password?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              We&apos;ll send a password reset link to your email and/or your assistant's email
              addresses.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(false)}
                disabled={state === 'loading'}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Dismiss
              </button>
              <button
                onClick={handleReset}
                disabled={state === 'loading'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {state === 'loading' ? 'Sending…' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
