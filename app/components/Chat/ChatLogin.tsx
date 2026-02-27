'use client'

import {useState} from 'react'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import NexusLogo from '@/app/components/NexusLogo'

type ChatLoginProps = {
  onLogin: (email: string, password: string) => Promise<boolean>
  error: string | null
}

export default function ChatLogin({onLogin, error}: ChatLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'login' | 'forgot'>('login')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onLogin(email, password)
    setLoading(false)
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    try {
      await fetch('/api/chat/forgot-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })
    } catch {
      // Still show success to avoid leaking info
    }
    setForgotLoading(false)
    setForgotSent(true)
  }

  if (view === 'forgot') {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600 text-sm">
              Enter your registered email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {forgotSent ? (
            <div className="space-y-4">
              <div className="text-green-700 text-sm text-center bg-green-50 py-3 px-4 rounded">
                Check your email for a reset link. It may take a minute to arrive.
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false)
                  setForgotLoading(false)
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Resend email
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('login')
                  setForgotSent(false)
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading || !email.trim()}
                className="w-full bg-nexus-navy-dark text-white py-3 px-4 rounded-md hover:bg-nexus-navy focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm cursor-pointer"
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <NexusLogo styleType="lockup" className="w-[168px] my-6 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600 text-sm">
            Connect directly with fellow attendees. Log in with your registered email and the
            password from your invitation email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                placeholder="Password"
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
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full bg-nexus-navy-dark text-white py-3 px-4 rounded-md hover:bg-nexus-navy focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
