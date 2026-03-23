import Link from 'next/link'
import {headers} from 'next/headers'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import NexusLogo from './NexusLogo'
import NotificationCenter from './NotificationCenter'
import UserNavMenu from './UserNavMenu'
import MobileNav from './MobileNav'
import NavLinks, {NavLink} from './NavLinks'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })
  const navLinks: NavLink[] = (settings?.navLinks as NavLink[]) || []
  const initialPathname = (await headers()).get('x-current-path') ?? '/'

  return (
    <header className="fixed top-0 left-0 right-0 z-[101] bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <NexusLogo styleType="lockup" className="w-[100px] h-[40px]" />
          </Link>

          <nav className="flex items-center gap-1">
            {/* Desktop links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              <NavLinks navLinks={navLinks} initialPathname={initialPathname} />
            </div>
            {/* Post-conference, do not need */}
            {/* <UserNavMenu /> */}
            <MobileNav navLinks={navLinks} />
          </nav>
        </div>
      </div>
    </header>
  )
}
