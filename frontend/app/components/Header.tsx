import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import NexusLogo from './NexusLogo'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const navLinks = settings?.navLinks || []

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <NexusLogo styleType="lockup" className="w-[100px] h-[40px]" />
          </Link>

          <nav className="flex items-center gap-3">
            {navLinks.map((link: any, index: number) => (
              <Link
                key={index}
                href={link.href}
                className={
                  link.highlighted
                    ? 'px-6 py-2 bg-blue-100 text-gray-900 rounded hover:bg-blue-200 transition-colors'
                    : 'px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
