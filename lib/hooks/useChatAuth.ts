'use client'

import {useState, useEffect, useCallback} from 'react'
import type {ChatUser} from '@/lib/types/chat'

export function useChatAuth() {
  const [user, setUser] = useState<ChatUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const res = await fetch('/api/chat/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return false
      }
      setUser(data.user)
      return true
    } catch {
      setError('An error occurred. Please try again.')
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/chat/logout', {method: 'POST'})
    } catch {
      // ignore
    }
    setUser(null)
  }, [])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        const res = await fetch('/api/chat/change-password', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({currentPassword, newPassword}),
        })
        const data = await res.json()
        if (!res.ok) {
          return {success: false, error: data.error || 'Failed to change password'}
        }
        return {success: true, error: null}
      } catch {
        return {success: false, error: 'An error occurred'}
      }
    },
    []
  )

  return {user, isAuthenticated, isLoading, error, login, logout, changePassword}
}
