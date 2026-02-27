'use client'

import {useState} from 'react'
import {ArrowLeftIcon, PaperAirplaneIcon} from '@heroicons/react/24/solid'
import {ChatAvatar} from './ConversationList'
import type {ChatUser, ChatMessageData, Conversation} from '@/lib/types/chat'

type ChatViewProps = {
  user: ChatUser
  conversation: Conversation | null
  messages: ChatMessageData[]
  isLoadingMessages: boolean
  onSend: (receiverId: string, content: string) => Promise<ChatMessageData | null>
  onBack: () => void
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
    </div>
  )
}

export default function ChatView({
  user,
  conversation,
  messages,
  isLoadingMessages,
  onSend,
  onBack,
}: ChatViewProps) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

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
          <p className="text-base font-medium">Select a conversation</p>
          <p className="text-sm mt-1">Choose an attendee to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <ChatAvatar
          name={conversation.partnerName}
          photo={conversation.partnerPhoto}
          online={conversation.partnerOnline}
          size="lg"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{conversation.partnerName}</p>
          <p className="text-xs text-gray-500 truncate">
            {[conversation.partnerTitle, conversation.partnerOrganization]
              .filter(Boolean)
              .join(', ')}
          </p>
          {conversation.partnerOnline && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">Online</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
        {isLoadingMessages ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-8">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === user.registrationId
            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isSelf ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 px-4 py-3 border-t border-gray-100"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          maxLength={2000}
          className="flex-1 rounded-lg border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  )
}
