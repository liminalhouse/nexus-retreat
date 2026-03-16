'use client'

import {useState, useEffect, useCallback} from 'react'
import type {ChatUser, Conversation} from '@/lib/types/chat'

export function useChatAuth(serverUser?: ChatUser | null, serverConversations?: Conversation[] | null) {
  const [user, setUser] = useState<ChatUser | null>(serverUser ?? null)
  const [initialConversations, setInitialConversations] = useState<Conversation[] | null>(serverConversations ?? null)
  const [isLoading, setIsLoading] = useState(!serverUser)

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
    // Skip client-side fetch if server already provided the user
    if (serverUser) return
    checkAuth()
  }, [checkAuth, serverUser])

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
