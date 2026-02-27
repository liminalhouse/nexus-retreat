'use client'

import {useState, useEffect, useRef} from 'react'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import {formatDistanceToNow} from 'date-fns'
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
      {/* Search bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for an attendee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Search results */}
      {searchQuery.trim() && (
        <div className="border-b border-gray-200">
          {isSearching ? (
            <div className="p-4 text-sm text-gray-500 text-center">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No results found</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((attendee) => (
                <button
                  key={attendee.id}
                  onClick={() => handleSelectAttendee(attendee)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <Avatar
                    name={`${attendee.firstName} ${attendee.lastName}`}
                    photo={attendee.profilePicture}
                    online={attendee.online}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attendee.firstName} {attendee.lastName}
                    </p>
                    {(attendee.title || attendee.organization) && (
                      <p className="text-xs text-gray-500 truncate">
                        {[attendee.title, attendee.organization].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 && !searchQuery ? (
          <div className="p-6 text-center text-sm text-gray-500">
            <p>No conversations yet.</p>
            <p className="mt-1">Search for an attendee to start chatting.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.partnerId}
              onClick={() => onSelect(conv.partnerId)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-gray-100 ${
                activePartnerId === conv.partnerId ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <Avatar
                name={conv.partnerName}
                photo={conv.partnerPhoto}
                online={conv.partnerOnline}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">{conv.partnerName}</p>
                  {conv.lastMessageAt && conv.lastMessage && (
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {formatDistanceToNow(new Date(conv.lastMessageAt), {addSuffix: false})}
                    </span>
                  )}
                </div>
                {(conv.partnerTitle || conv.partnerOrganization) && (
                  <p className="text-xs text-gray-500 truncate">
                    {[conv.partnerTitle, conv.partnerOrganization].filter(Boolean).join(' · ')}
                  </p>
                )}
                {conv.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                )}
              </div>
              {conv.unreadCount > 0 && (
                <span className="flex-shrink-0 bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
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

// Avatar component used within this file
function Avatar({
  name,
  photo,
  online,
  size = 'md',
}: {
  name: string
  photo: string | null
  online: boolean
  size?: 'sm' | 'md'
}) {
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative flex-shrink-0">
      {photo ? (
        <img
          src={photo}
          alt={name}
          className={`${sizeClasses} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600`}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${dotSize} bg-green-500 border-2 border-white rounded-full`}
        />
      )}
    </div>
  )
}
