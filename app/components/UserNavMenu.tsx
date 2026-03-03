'use client'

import {useState, useEffect, useRef} from 'react'
import Link from 'next/link'
import Avatar from './Avatar'
import type {ChatUser} from '@/lib/types/chat'
import ChatNavIcon from './ChatNavIcon'

export default function UserNavMenu() {
  const [user, setUser] = useState<ChatUser | null | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/chat/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleLogout() {
    await fetch('/api/chat/logout', {method: 'POST'})
    window.location.href = '/login'
  }

  if (user === undefined) return null

  if (!user) {
    return (
      <>
        <Link
          href="/chat"
          className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Chat
        </Link>
        <Link
          href="/login"
          className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Login
        </Link>
      </>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <ChatNavIcon />
        <div className="md:w-2" />
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-1 rounded-full focus:outline-none"
            aria-label="Account menu"
            aria-expanded={open}
          >
            <Avatar
              src={user.profilePicture}
              firstName={user.firstName}
              lastName={user.lastName}
              size="sm"
            />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              {/* Triangle caret pointing up, aligned to avatar */}
              <div className="absolute -top-[7px] right-3 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                {(user.title || user.organization) && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {[user.title, user.organization].filter(Boolean).join(', ')}
                  </p>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
