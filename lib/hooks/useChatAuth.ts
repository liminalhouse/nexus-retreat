'use client'

import {useState, useEffect, useCallback} from 'react'
import type {ChatUser, Conversation} from '@/lib/types/chat'

export function useChatAuth() {
  const [user, setUser] = useState<ChatUser | null>(null)
  const [initialConversations, setInitialConversations] = useState<Conversation[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setInitialConversations(data.conversations || [])
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

  const logout = useCallback(async () => {
    try {
      await fetch('/api/chat/logout', {method: 'POST'})
    } catch {
      // ignore
    }
    window.location.href = '/chat/login'
  }, [])

  return {user, isLoading, initialConversations, logout}
}
