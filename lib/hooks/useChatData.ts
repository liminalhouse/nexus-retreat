'use client'

import {useState, useEffect, useCallback, useRef} from 'react'
import type {ChatUser, ChatMessageData, Conversation, Attendee} from '@/lib/types/chat'

export function useChatData(user: ChatUser | null, initialConversations?: Conversation[] | null) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const initializedRef = useRef(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sseErrorCountRef = useRef(0)
  const activePartnerIdRef = useRef<string | null>(null)
  const conversationsRef = useRef<Conversation[]>([])

  // Keep refs in sync
  useEffect(() => {
    activePartnerIdRef.current = activePartnerId
  }, [activePartnerId])

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  // Seed conversations from initial data and auto-select the latest conversation
  useEffect(() => {
    if (initialConversations && !initializedRef.current) {
      setConversations(initialConversations)
      initializedRef.current = true

      const firstPartnerId = initialConversations[0]?.partnerId ?? null
      const isDesktop = window.innerWidth >= 768
      if (firstPartnerId && user && isDesktop) {
        // Select the latest conversation (desktop only — mobile shows the list first)
        setActivePartnerId(firstPartnerId)
        activePartnerIdRef.current = firstPartnerId

        // Dispatch before fetch so the nav icon clears optimistically
        const autoConv = initialConversations.find((c) => c.partnerId === firstPartnerId)
        if (autoConv?.unreadCount) {
          window.dispatchEvent(
            new CustomEvent('chatMessagesRead', {detail: {count: autoConv.unreadCount}})
          )
        }

        setIsLoadingMessages(true)
        fetch(`/api/chat/messages/${firstPartnerId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) setMessages(data.messages)
          })
          .catch(() => {})
          .finally(() => setIsLoadingMessages(false))
      }
    }
  }, [initialConversations, user])

  // Fetch conversations — merges with existing temp conversations so they don't vanish
  const fetchConversations = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch('/api/chat/conversations')
      if (res.ok) {
        const data = await res.json()
        const apiConversations: Conversation[] = data.conversations
        const apiPartnerIds = new Set(apiConversations.map((c: Conversation) => c.partnerId))

        setConversations((prev) => {
          const tempToKeep = prev.filter(
            (c) =>
              !apiPartnerIds.has(c.partnerId) &&
              !c.lastMessage &&
              c.partnerId === activePartnerIdRef.current
          )
          return [...tempToKeep, ...apiConversations]
        })
      }
    } catch {
      // ignore
    }
  }, [user])

  // Fetch message history with a partner
  const fetchMessages = useCallback(
    async (partnerId: string) => {
      if (!user) return
      setIsLoadingMessages(true)
      try {
        const res = await fetch(`/api/chat/messages/${partnerId}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages)
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingMessages(false)
      }
    },
    [user]
  )

  // Select a conversation
  const selectConversation = useCallback(
    (partnerId: string | null) => {
      setActivePartnerId(partnerId)
      if (partnerId) {
        fetchMessages(partnerId)
        // Notify nav icon using ref (safe to read outside updater), then clear local state
        const conv = conversationsRef.current.find((c) => c.partnerId === partnerId)
        if (conv?.unreadCount) {
          window.dispatchEvent(
            new CustomEvent('chatMessagesRead', {detail: {count: conv.unreadCount}})
          )
        }
        setConversations((prev) =>
          prev.map((c) => (c.partnerId === partnerId ? {...c, unreadCount: 0} : c))
        )
      } else {
        setMessages([])
      }
    },
    [fetchMessages]
  )

  // Send a message — optimistic: show immediately, send in background
  const sendMessage = useCallback(
    async (receiverId: string, content: string) => {
      if (!user) return null

      const tempId = `temp-${Date.now()}-${Math.random()}`
      const now = new Date().toISOString()

      // Optimistically add message to UI immediately
      const optimisticMsg: ChatMessageData = {
        id: tempId,
        senderId: user.registrationId,
        receiverId,
        content,
        readAt: null,
        createdAt: now,
      }
      setMessages((prev) => [...prev, optimisticMsg])

      // Optimistically update conversation list
      setConversations((prev) => {
        const existing = prev.find((c) => c.partnerId === receiverId)
        if (existing) {
          return prev
            .map((c) =>
              c.partnerId === receiverId
                ? {
                    ...c,
                    lastMessage: content,
                    lastMessageAt: now,
                    lastMessageSenderId: user.registrationId,
                  }
                : c
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
            )
        }
        return prev
      })

      // Send to API in background
      try {
        const res = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({receiverId, content}),
        })
        if (!res.ok) {
          // Remove optimistic message on failure
          setMessages((prev) => prev.filter((m) => m.id !== tempId))
          return null
        }
        const data = await res.json()
        const realMsg: ChatMessageData = data.message

        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? realMsg : m))
        )

        return realMsg
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        return null
      }
    },
    [user]
  )

  // Search attendees
  const searchAttendees = useCallback(
    async (query: string): Promise<Attendee[]> => {
      if (!user) return []
      try {
        const res = await fetch(`/api/chat/attendees?q=${encodeURIComponent(query)}`)
        if (!res.ok) return []
        const data = await res.json()
        return data.attendees
      } catch {
        return []
      }
    },
    [user]
  )

  // Start a new conversation (select partner from search)
  const startNewConversation = useCallback(
    (attendee: Attendee) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.partnerId === attendee.id)
        if (existing) return prev
        return [
          {
            partnerId: attendee.id,
            partnerName: `${attendee.firstName} ${attendee.lastName}`,
            partnerTitle: attendee.title,
            partnerOrganization: attendee.organization,
            partnerPhoto: attendee.profilePicture,
            partnerOnline: attendee.online,
            lastMessage: '',
            lastMessageAt: new Date().toISOString(),
            lastMessageSenderId: '',
            unreadCount: 0,
          },
          ...prev,
        ]
      })
      selectConversation(attendee.id)
    },
    [selectConversation]
  )

  // Fallback poll — used only if SSE fails persistently
  const poll = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch('/api/chat/poll')
      if (!res.ok) return
      const data = await res.json()
      const hasNewMessages = data.messages?.length > 0
      if (hasNewMessages && activePartnerIdRef.current) {
        const relevantMessages = data.messages.filter(
          (m: ChatMessageData) =>
            m.senderId === activePartnerIdRef.current ||
            m.receiverId === activePartnerIdRef.current
        )
        if (relevantMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id))
            const newMsgs = relevantMessages.filter(
              (m: ChatMessageData) => !existingIds.has(m.id)
            )
            if (newMsgs.length === 0) return prev
            return [...prev, ...newMsgs].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          })
        }
      }
      if (hasNewMessages) {
        fetchConversations()
        const incomingFromOthers = data.messages.filter(
          (m: ChatMessageData) =>
            m.receiverId === user.registrationId &&
            m.senderId !== activePartnerIdRef.current
        )
        if (incomingFromOthers.length > 0) {
          window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'))
        }
      }
    } catch {
      // ignore
    }
  }, [user, fetchConversations])

  // SSE stream setup with visibility handling and polling fallback
  useEffect(() => {
    if (!user) return

    function setupStream() {
      eventSourceRef.current?.close()
      sseErrorCountRef.current = 0

      const es = new EventSource('/api/chat/stream')

      es.addEventListener('messages', (event) => {
        sseErrorCountRef.current = 0
        const data = JSON.parse((event as MessageEvent).data)
        const hasNewMessages = data.messages?.length > 0

        if (hasNewMessages && activePartnerIdRef.current) {
          const relevantMessages = data.messages.filter(
            (m: ChatMessageData) =>
              m.senderId === activePartnerIdRef.current ||
              m.receiverId === activePartnerIdRef.current
          )
          if (relevantMessages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id))
              const newMsgs = relevantMessages.filter(
                (m: ChatMessageData) => !existingIds.has(m.id)
              )
              if (newMsgs.length === 0) return prev
              return [...prev, ...newMsgs].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              )
            })
          }
        }

        if (hasNewMessages) {
          fetchConversations()
          // Notify nav icon if new unread messages arrived from a non-active partner
          const incomingFromOthers = data.messages.filter(
            (m: ChatMessageData) =>
              m.receiverId === user.registrationId &&
              m.senderId !== activePartnerIdRef.current
          )
          if (incomingFromOthers.length > 0) {
            window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'))
          }
        }
      })

      es.onerror = () => {
        sseErrorCountRef.current++
        if (sseErrorCountRef.current >= 5) {
          // SSE persistently failing — fall back to 4s polling
          es.close()
          eventSourceRef.current = null
          pollIntervalRef.current = setInterval(poll, 4000)
        }
      }

      eventSourceRef.current = es
    }

    setupStream()

    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        eventSourceRef.current?.close()
        eventSourceRef.current = null
      } else {
        // Tab visible again — clear fallback poll if active and reopen stream
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
          pollIntervalRef.current = null
        }
        setupStream()
        fetchConversations() // catch up while stream re-establishes
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      eventSourceRef.current?.close()
      eventSourceRef.current = null
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [user, fetchConversations, poll])

  return {
    conversations,
    messages,
    activePartnerId,
    isLoadingMessages,
    selectConversation,
    sendMessage,
    searchAttendees,
    startNewConversation,
  }
}
