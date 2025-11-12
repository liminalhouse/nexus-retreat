import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import NexusLogo from './NexusLogo'

export default async function Footer() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const tagline = settings?.footerTagline || 'George Pyne • Jay Penske'
  const email = settings?.footerEmail || 'nexus-retreat@gmail.com'
  const quickLinks = settings?.footerQuickLinks || []
  const copyright =
    settings?.footerCopyright ||
    'Copyright © Bruin Capital Holdings, LLC 2025. All rights reserved.'

  return (
    <footer className="bg-nexus-navy-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link: any, index: number) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <a
              href={`mailto:${email}`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {email}
            </a>
          </div>

          {/* Logo */}
          {/* <div className="flex justify-start md:justify-end items-start">
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight mb-1">
                <NexusLogo />
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{tagline}</div>
            </div>
          </div> */}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-600 text-center text-sm text-gray-400">
          {copyright}
        </div>
      </div>
    </footer>
  )
}
