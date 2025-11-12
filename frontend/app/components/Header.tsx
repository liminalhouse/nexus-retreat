import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            NEXUS
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="px-6 py-2 bg-blue-100 text-gray-900 rounded hover:bg-blue-200 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/faq"
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
