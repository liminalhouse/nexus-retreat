import Link from 'next/link'
import {getUser} from '@/lib/auth/getUser'
import UserMenu from './UserMenu'

export default async function AdminLayout({children}: {children: React.ReactNode}) {
  const user = await getUser()

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              NEXUS Admin
            </Link>
            <div className="flex items-center gap-4">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}
