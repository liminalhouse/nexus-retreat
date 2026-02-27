'use client'

import {useState, useEffect, useCallback, useRef} from 'react'
import type {ChatUser, ChatMessageData, Conversation, Attendee} from '@/lib/types/chat'

const POLL_INTERVAL = 4000

export function useChatData(user: ChatUser | null, initialConversations?: Conversation[] | null) {
  const autoSelectId = initialConversations?.[0]?.partnerId ?? null
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations || [])
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [activePartnerId, setActivePartnerId] = useState<string | null>(autoSelectId)
  const [isLoadingMessages, setIsLoadingMessages] = useState(!!autoSelectId)
  const initializedRef = useRef(false)
  const lastPollTimestamp = useRef<string | null>(null)
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const activePartnerIdRef = useRef<string | null>(autoSelectId)

  // Keep ref in sync
  useEffect(() => {
    activePartnerIdRef.current = activePartnerId
  }, [activePartnerId])

  // Seed conversations from initial data and fetch messages for auto-selected conversation
  useEffect(() => {
    if (initialConversations && !initializedRef.current) {
      setConversations(initialConversations)
      initializedRef.current = true
      // Fetch messages for auto-selected conversation
      if (autoSelectId && user) {
        fetch(`/api/chat/messages/${autoSelectId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) setMessages(data.messages)
          })
          .catch(() => {})
          .finally(() => setIsLoadingMessages(false))
      }
    }
  }, [initialConversations, user, autoSelectId])

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
        // Clear unread count for this partner
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

  // Poll for updates
  const poll = useCallback(async () => {
    if (!user) return
    try {
      const url = lastPollTimestamp.current
        ? `/api/chat/poll?since=${encodeURIComponent(lastPollTimestamp.current)}`
        : '/api/chat/poll'

      const res = await fetch(url)
      if (!res.ok) return
      const data = await res.json()

      lastPollTimestamp.current = data.timestamp

      const hasNewMessages = data.messages?.length > 0

      // Update messages if viewing a conversation
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

      // Only refetch conversations when there are actually new messages
      if (hasNewMessages) {
        fetchConversations()
      }
    } catch {
      // ignore poll errors
    }
  }, [user, fetchConversations])

  // Setup polling (skip initial fetch — conversations come from /api/chat/me)
  useEffect(() => {
    if (!user) return

    pollInterval.current = setInterval(poll, POLL_INTERVAL)
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
      }
    }
  }, [user, poll, fetchConversations])

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
