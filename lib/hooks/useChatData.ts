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
  const messageCacheRef = useRef<Map<string, ChatMessageData[]>>(new Map())

  // Keep refs in sync
  useEffect(() => {
    activePartnerIdRef.current = activePartnerId
  }, [activePartnerId])

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  // Sequentially prefetch messages for all conversations not yet in cache.
  // convs defaults to conversationsRef so it works from both effects and callbacks.
  async function prefetchOthers(skipPartnerId: string, convs?: Conversation[]) {
    const list = convs ?? conversationsRef.current
    for (const conv of list) {
      if (conv.partnerId === skipPartnerId) continue
      if (messageCacheRef.current.has(conv.partnerId)) continue
      try {
        const res = await fetch(`/api/chat/messages/${conv.partnerId}`)
        if (res.ok) {
          const data = await res.json()
          // Only write to cache if still absent (another path may have fetched it)
          if (!messageCacheRef.current.has(conv.partnerId)) {
            messageCacheRef.current.set(conv.partnerId, data.messages)
          }
        }
      } catch {
        // ignore — this is best-effort background work
      }
    }
  }

  // Merge new messages into the cache for a partner; returns the merged array
  function mergeIntoCache(partnerId: string, newMsgs: ChatMessageData[]): ChatMessageData[] {
    const existing = messageCacheRef.current.get(partnerId) ?? []
    const existingIds = new Set(existing.map((m) => m.id))
    const fresh = newMsgs.filter((m) => !existingIds.has(m.id))
    if (fresh.length === 0) return existing
    const merged = [...existing, ...fresh].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    messageCacheRef.current.set(partnerId, merged)
    return merged
  }

  // Seed conversations from initial data and auto-select the latest conversation
  useEffect(() => {
    if (initialConversations && !initializedRef.current) {
      setConversations(initialConversations)
      initializedRef.current = true

      const firstPartnerId = initialConversations[0]?.partnerId ?? null
      const isDesktop = window.innerWidth >= 768
      if (firstPartnerId && user && isDesktop) {
        setActivePartnerId(firstPartnerId)
        activePartnerIdRef.current = firstPartnerId

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
            if (data) {
              messageCacheRef.current.set(firstPartnerId, data.messages)
              setMessages(data.messages)
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsLoadingMessages(false)
            // Prefetch all other conversations in the background
            prefetchOthers(firstPartnerId, initialConversations)
          })
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
          // Keep any local conversation for the active partner not yet confirmed by the API
          // (covers both empty temp entries and optimistically-promoted pending attendees)
          const localToKeep = prev.filter(
            (c) =>
              !apiPartnerIds.has(c.partnerId) &&
              c.partnerId === activePartnerIdRef.current
          )
          return [...localToKeep, ...apiConversations]
        })
      }
    } catch {
      // ignore
    }
  }, [user])

  // Fetch message history — always updates cache; showLoading controls the spinner
  const fetchMessages = useCallback(
    async (partnerId: string, showLoading: boolean) => {
      if (!user) return
      if (showLoading) setIsLoadingMessages(true)
      try {
        const res = await fetch(`/api/chat/messages/${partnerId}`)
        if (res.ok) {
          const data = await res.json()
          messageCacheRef.current.set(partnerId, data.messages)
          // Only push to state if this partner is still active
          if (activePartnerIdRef.current === partnerId) {
            setMessages(data.messages)
          }
        }
      } catch {
        // ignore
      } finally {
        if (showLoading) {
          setIsLoadingMessages(false)
          // Cold load finished — prefetch remaining uncached conversations
          prefetchOthers(partnerId)
        }
      }
    },
    [user] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Select a conversation
  const selectConversation = useCallback(
    (partnerId: string | null) => {
      updatePendingAttendee(null)
      setActivePartnerId(partnerId)
      if (partnerId) {
        const cached = messageCacheRef.current.get(partnerId)
        if (cached) {
          setMessages(cached) // instant — no spinner
          fetchMessages(partnerId, false) // silent background refresh
        } else {
          fetchMessages(partnerId, true) // cold load — show spinner
        }
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

      const optimisticMsg: ChatMessageData = {
        id: tempId,
        senderId: user.registrationId,
        receiverId,
        content,
        readAt: null,
        createdAt: now,
      }

      // Update state and cache with optimistic message
      setMessages((prev) => {
        const updated = [...prev, optimisticMsg]
        messageCacheRef.current.set(receiverId, updated)
        return updated
      })

      // Optimistically update conversation list — promote pending attendee if needed
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
        // Not in conversations yet — promote pending attendee (read from ref, always fresh)
        const pending = pendingAttendeeRef.current
        if (pending && pending.id === receiverId) {
          return [
            {
              partnerId: pending.id,
              partnerName: `${pending.firstName} ${pending.lastName}`,
              partnerTitle: pending.title,
              partnerOrganization: pending.organization,
              partnerPhoto: pending.profilePicture,
              partnerOnline: pending.online,
              lastMessage: content,
              lastMessageAt: now,
              lastMessageSenderId: user.registrationId,
              unreadCount: 0,
            },
            ...prev,
          ]
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
          setMessages((prev) => {
            const updated = prev.filter((m) => m.id !== tempId)
            messageCacheRef.current.set(receiverId, updated)
            return updated
          })
          return null
        }
        const data = await res.json()
        const realMsg: ChatMessageData = data.message

        setMessages((prev) => {
          const updated = prev.map((m) => (m.id === tempId ? realMsg : m))
          messageCacheRef.current.set(receiverId, updated)
          return updated
        })

        return realMsg
      } catch {
        setMessages((prev) => {
          const updated = prev.filter((m) => m.id !== tempId)
          messageCacheRef.current.set(receiverId, updated)
          return updated
        })
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

  // Pending attendee — selected from "All Attendees" but no message sent yet
  const [pendingAttendee, setPendingAttendee] = useState<Attendee | null>(null)
  const pendingAttendeeRef = useRef<Attendee | null>(null)

  function updatePendingAttendee(attendee: Attendee | null) {
    pendingAttendeeRef.current = attendee
    setPendingAttendee(attendee)
  }

  // Clear pendingAttendee only once conversations has confirmed the partner entry
  useEffect(() => {
    if (pendingAttendee && conversations.some((c) => c.partnerId === pendingAttendee.id)) {
      updatePendingAttendee(null)
    }
  }, [conversations, pendingAttendee])

  // Start a new conversation (select partner from search dropdown — adds temp entry)
  const startNewConversation = useCallback(
    (attendee: Attendee) => {
      updatePendingAttendee(null)
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

  // Select an attendee from the "All Attendees" list — opens chat WITHOUT adding to conversations
  const selectAttendee = useCallback(
    (attendee: Attendee) => {
      const alreadyInConversations = conversationsRef.current.some((c) => c.partnerId === attendee.id)
      if (alreadyInConversations) {
        updatePendingAttendee(null)
        selectConversation(attendee.id)
      } else {
        updatePendingAttendee(attendee)
        setActivePartnerId(attendee.id)
        activePartnerIdRef.current = attendee.id
        const cached = messageCacheRef.current.get(attendee.id)
        if (cached) {
          setMessages(cached)
        } else {
          setIsLoadingMessages(true)
          fetch(`/api/chat/messages/${attendee.id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data) {
                messageCacheRef.current.set(attendee.id, data.messages)
                if (activePartnerIdRef.current === attendee.id) setMessages(data.messages)
              }
            })
            .catch(() => {})
            .finally(() => setIsLoadingMessages(false))
        }
      }
    },
    [selectConversation]
  )

  // Handle incoming messages from SSE or poll: update cache for all partners,
  // push to state only for the active partner, and notify nav icon of new unread messages
  function handleIncomingMessages(incomingMsgs: ChatMessageData[]) {
    if (incomingMsgs.length === 0) return

    // Group by partner
    const byPartner = new Map<string, ChatMessageData[]>()
    for (const msg of incomingMsgs) {
      const partnerId =
        msg.senderId === user!.registrationId ? msg.receiverId : msg.senderId
      if (!byPartner.has(partnerId)) byPartner.set(partnerId, [])
      byPartner.get(partnerId)!.push(msg)
    }

    for (const [partnerId, msgs] of byPartner) {
      const merged = mergeIntoCache(partnerId, msgs)
      if (partnerId === activePartnerIdRef.current) {
        setMessages(merged)
      }
    }

    // Notify nav icon if any incoming messages are from non-active partners
    const hasUnseenFromOthers = incomingMsgs.some(
      (m) =>
        m.receiverId === user!.registrationId &&
        m.senderId !== activePartnerIdRef.current
    )
    if (hasUnseenFromOthers) {
      window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'))
    }
  }

  // Fallback poll — used only if SSE fails persistently
  const poll = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch('/api/chat/poll')
      if (!res.ok) return
      const data = await res.json()
      if (data.messages?.length > 0) {
        handleIncomingMessages(data.messages)
        fetchConversations()
      }
    } catch {
      // ignore
    }
  }, [user, fetchConversations]) // eslint-disable-line react-hooks/exhaustive-deps

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
        if (data.messages?.length > 0) {
          handleIncomingMessages(data.messages)
          fetchConversations()
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
  }, [user, fetchConversations, poll]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    conversations,
    messages,
    activePartnerId,
    isLoadingMessages,
    selectConversation,
    sendMessage,
    searchAttendees,
    startNewConversation,
    selectAttendee,
    pendingAttendee,
  }
}
