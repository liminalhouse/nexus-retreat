'use client'

import {useState, useEffect} from 'react'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import {useChatAuth} from '@/lib/hooks/useChatAuth'
import {useChatData} from '@/lib/hooks/useChatData'
import ChatLogin from './ChatLogin'
import ConversationList from './ConversationList'
import ChatView from './ChatView'
import ChangePasswordModal from './ChangePasswordModal'
import {ArrowRightStartOnRectangleIcon, KeyIcon} from '@heroicons/react/24/outline'

const CONVERSATION_COUNT_KEY = 'chat-conversation-count'

function getStoredConversationCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const stored = localStorage.getItem(CONVERSATION_COUNT_KEY)
    return stored ? Math.min(parseInt(stored, 10), 8) : 0
  } catch {
    return 0
  }
}

function Pulse({className = ''}: {className?: string}) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
}

function ChatSkeleton() {
  const count = getStoredConversationCount()

  return (
    <div className="flex h-full rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-100">
        {/* User header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <Pulse className="h-4 w-28 mb-1.5" />
            <Pulse className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="p-2 text-gray-300">
              <KeyIcon className="w-4 h-4" />
            </div>
            <div className="p-2 text-gray-300">
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
        {/* Real search UI — this is static */}
        <div className="p-4 pb-3">
          <p className="text-sm font-semibold text-gray-900 mb-3">Search for an attendee</p>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Type name to search..."
              disabled
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-gray-200 bg-gray-50"
            />
          </div>
        </div>
        {/* Real label */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-4 pt-3 pb-2">
          All Conversations
        </p>
        {/* Conversation item skeletons — count from last session */}
        {Array.from({length: count}, (_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Pulse className="w-11 h-11 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <Pulse className="h-4 w-24" />
                <Pulse className="h-3 w-12" />
              </div>
              <Pulse className="h-3 w-32 mb-1" />
              <Pulse className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
      {/* Chat panel — spinner */}
      <div className="hidden md:flex flex-col flex-1 items-center justify-center text-gray-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
      </div>
    </div>
  )
}

export default function ChatContainer() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialConversations,
    login,
    logout,
    changePassword,
  } = useChatAuth()
  const {
    conversations,
    messages,
    activePartnerId,
    isLoadingMessages,
    selectConversation,
    sendMessage,
    searchAttendees,
    startNewConversation,
  } = useChatData(user, initialConversations)

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Cache conversation count for skeleton accuracy on next load
  useEffect(() => {
    if (conversations.length > 0) {
      try {
        localStorage.setItem(CONVERSATION_COUNT_KEY, String(conversations.length))
      } catch {}
    }
  }, [conversations.length])

  if (isLoading) {
    return <ChatSkeleton />
  }

  if (!isAuthenticated || !user) {
    return <ChatLogin onLogin={login} error={error} />
  }

  const activeConversation = conversations.find((c) => c.partnerId === activePartnerId) || null

  return (
    <div className="flex h-full rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={`${
          activePartnerId ? 'hidden md:flex' : 'flex'
        } flex-col w-full md:w-80 lg:w-96 border-r border-gray-100`}
      >
        {/* User header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {[user.title, user.organization].filter(Boolean).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShowPasswordModal(true)}
              title="Change password"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <KeyIcon className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              title="Sign out"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ConversationList
          conversations={conversations}
          activePartnerId={activePartnerId}
          onSelect={selectConversation}
          onSearch={searchAttendees}
          onStartNew={startNewConversation}
        />
      </div>

      {/* Chat panel */}
      <div className={`${activePartnerId ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
        <ChatView
          user={user}
          conversation={activeConversation}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          onSend={sendMessage}
          onBack={() => selectConversation(null)}
        />
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={changePassword}
        />
      )}
    </div>
  )
}
