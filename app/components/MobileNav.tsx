'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import NexusLogo from './NexusLogo'

type NavLink = {
  href: string
  label: string
  highlighted?: boolean | null
}

export default function MobileNav({navLinks}: {navLinks: NavLink[]}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200] bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 bottom-0 z-[201] w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href={'/'}>
                <NexusLogo styleType="lockup" className="w-auto h-4" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col py-2">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={
                    link.highlighted
                      ? 'px-5 py-3 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'
                      : 'px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
