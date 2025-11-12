import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#3d4663] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/registration" className="text-gray-300 hover:text-white transition-colors">
                  Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <a
              href="mailto:nexus-retreat@gmail.com"
              className="text-gray-300 hover:text-white transition-colors"
            >
              nexus-retreat@gmail.com
            </a>
          </div>

          {/* Logo */}
          <div className="flex justify-start md:justify-end items-start">
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight mb-1">NEXUS</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                George Pyne • Jay Penske
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-600 text-center text-sm text-gray-400">
          Copyright © Bruin Capital Holdings, LLC 2025. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
