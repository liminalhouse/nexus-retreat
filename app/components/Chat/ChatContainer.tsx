'use client'

import {useState} from 'react'
import {useChatAuth} from '@/lib/hooks/useChatAuth'
import {useChatData} from '@/lib/hooks/useChatData'
import ChatLogin from './ChatLogin'
import ConversationList from './ConversationList'
import ChatView from './ChatView'
import ChangePasswordModal from './ChangePasswordModal'
import {
  ArrowRightStartOnRectangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'

export default function ChatContainer() {
  const {user, isAuthenticated, isLoading, error, login, logout, changePassword} = useChatAuth()
  const {
    conversations,
    messages,
    activePartnerId,
    isLoadingMessages,
    selectConversation,
    sendMessage,
    searchAttendees,
    startNewConversation,
  } = useChatData(user)

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
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
      <div
        className={`${
          activePartnerId ? 'flex' : 'hidden md:flex'
        } flex-col flex-1`}
      >
        <ChatView
          user={user}
          conversation={activeConversation}
          messages={messages}
          isLoading={isLoadingMessages}
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
