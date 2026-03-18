'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

export type NavLink = {
  href: string
  label: string
  highlighted?: boolean
}

export default function NavLinks({
  navLinks,
  initialPathname,
}: {
  navLinks: NavLink[]
  initialPathname: string
}) {
  const pathname = usePathname() ?? initialPathname

  function linkClass(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
      ? 'px-6 py-2 text-nexus-coral font-semibold transition-colors'
      : 'px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors'
  }

  return (
    <>
      {navLinks.map((link, index) => (
        <Link key={index} href={link.href} className={linkClass(link.href)}>
          {link.label}
        </Link>
      ))}
    </>
  )
}
