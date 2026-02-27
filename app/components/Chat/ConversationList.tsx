'use client'

import {useState, useEffect, useRef} from 'react'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import {formatDistanceToNow} from 'date-fns'
import Avatar from '@/app/components/Avatar'
import type {Conversation, Attendee} from '@/lib/types/chat'

type ConversationListProps = {
  conversations: Conversation[]
  activePartnerId: string | null
  onSelect: (partnerId: string | null) => void
  onSearch: (query: string) => Promise<Attendee[]>
  onStartNew: (attendee: Attendee) => void
}

export default function ConversationList({
  conversations,
  activePartnerId,
  onSelect,
  onSearch,
  onStartNew,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Attendee[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    searchTimeout.current = setTimeout(async () => {
      const results = await onSearch(searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [searchQuery, onSearch])

  const handleSelectAttendee = (attendee: Attendee) => {
    onStartNew(attendee)
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 pb-3">
        <p className="text-sm font-semibold text-gray-900 mb-3">Search for an attendee</p>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Type name to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Search results */}
      {searchQuery.trim() && (
        <div className="border-b border-gray-100">
          {isSearching ? (
            <div className="p-4 text-sm text-gray-500 text-center">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No results found</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((attendee) => {
                const name = `${attendee.firstName} ${attendee.lastName}`
                return (
                  <button
                    key={attendee.id}
                    onClick={() => handleSelectAttendee(attendee)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <ChatAvatar
                      name={name}
                      photo={attendee.profilePicture}
                      online={attendee.online}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                      {(attendee.title || attendee.organization) && (
                        <p className="text-xs text-gray-500 truncate">
                          {[attendee.title, attendee.organization].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-4 pt-3 pb-2">
          All Conversations
        </p>
        {conversations.length === 0 && !searchQuery ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <p>No conversations yet.</p>
            <p className="mt-1">Search for an attendee to start chatting.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.partnerId}
              onClick={() => onSelect(conv.partnerId)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                activePartnerId === conv.partnerId ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <ChatAvatar
                name={conv.partnerName}
                photo={conv.partnerPhoto}
                online={conv.partnerOnline}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{conv.partnerName}</p>
                  {conv.lastMessageAt && conv.lastMessage && (
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {formatDistanceToNow(new Date(conv.lastMessageAt), {addSuffix: false})} ago
                    </span>
                  )}
                </div>
                {(conv.partnerTitle || conv.partnerOrganization) && (
                  <p className="text-xs text-gray-500 truncate">
                    {[conv.partnerTitle, conv.partnerOrganization].filter(Boolean).join(', ')}
                  </p>
                )}
                {conv.lastMessage && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                )}
              </div>
              {conv.unreadCount > 0 && (
                <span className="flex-shrink-0 bg-blue-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function ChatAvatar({
  name,
  photo,
  online,
  size = 'md',
}: {
  name: string
  photo: string | null
  online: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const dotClasses = {
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
  }

  const [firstName = '', lastName = ''] = name.split(' ')

  return (
    <div className="relative flex-shrink-0">
      <Avatar src={photo} firstName={firstName} lastName={lastName} size={size} />
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${dotClasses[size]} bg-green-500 border-white rounded-full`}
        />
      )}
    </div>
  )
}

export {ChatAvatar}
