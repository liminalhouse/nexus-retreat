'use client'

import {useState, useEffect} from 'react'
import {useSearchParams, useRouter} from 'next/navigation'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import NexusLogo from '@/app/components/NexusLogo'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] text-center">
          <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 text-sm mb-6">
            This password reset link is invalid. Please request a new one from the login page.
          </p>
          <Link href="/chat" className="text-sm font-medium text-nexus-navy-dark hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push('/chat'), 2000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  if (success) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] text-center">
          <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset</h1>
          <div className="text-green-600 text-sm bg-green-50 py-3 px-4 rounded mb-6">
            Your password has been reset successfully. Redirecting to login...
          </div>
          <Link
            href="/chat"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/chat/reset-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token, newPassword}),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center flex-col h-full px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          <p className="text-gray-600 text-sm">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
            className="w-full bg-nexus-navy-dark text-white py-3 px-4 rounded-md hover:bg-nexus-navy focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm cursor-pointer"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/chat" className="text-sm text-gray-500 hover:text-gray-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
