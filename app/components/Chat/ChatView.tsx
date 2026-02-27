'use client'

import {useState, useEffect, useRef} from 'react'
import {ArrowLeftIcon, PaperAirplaneIcon} from '@heroicons/react/24/solid'
import type {ChatUser, ChatMessageData, Conversation} from '@/lib/types/chat'

type ChatViewProps = {
  user: ChatUser
  conversation: Conversation | null
  messages: ChatMessageData[]
  isLoading: boolean
  onSend: (receiverId: string, content: string) => Promise<ChatMessageData | null>
  onBack: () => void
}

export default function ChatView({
  user,
  conversation,
  messages,
  isLoading,
  onSend,
  onBack,
}: ChatViewProps) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !conversation || sending) return

    const content = input.trim()
    setInput('')
    setSending(true)
    await onSend(conversation.partnerId, content)
    setSending(false)
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <p className="text-lg">Select a conversation</p>
          <p className="text-sm mt-1">Choose an attendee to start chatting</p>
        </div>
      </div>
    )
  }

  const initials = conversation.partnerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={onBack}
          className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div className="relative flex-shrink-0">
          {conversation.partnerPhoto ? (
            <img
              src={conversation.partnerPhoto}
              alt={conversation.partnerName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 text-sm">
              {initials}
            </div>
          )}
          {conversation.partnerOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {conversation.partnerName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {conversation.partnerOnline
              ? 'Online'
              : [conversation.partnerTitle, conversation.partnerOrganization]
                  .filter(Boolean)
                  .join(' · ') || ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center text-sm text-gray-400 py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-8">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === user.registrationId
            return (
              <div
                key={msg.id}
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isSelf
                      ? 'bg-slate-800 text-white'
                      : 'bg-red-50 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isSelf ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={2000}
          className="flex-1 rounded-full border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
