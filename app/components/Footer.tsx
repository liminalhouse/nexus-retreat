import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import NexusLogo from './NexusLogo'
import SanityImageClient from './SanityImageClient'

export default async function Footer() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const tagline = settings?.footerTagline || 'George Pyne • Jay Penske'
  const email = settings?.footerEmail || 'info@nexus-retreat.com'
  const quickLinks = settings?.footerQuickLinks || []
  const copyright =
    settings?.footerCopyright ||
    'Copyright © Bruin Capital Holdings, LLC 2025. All rights reserved.'
  const footerLogos = settings?.footerLogos || []

  return (
    <footer className="bg-nexus-navy-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
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

        {/* Partner Logos */}
        {footerLogos.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-600">
            <div
              className="flex flex-wrap justify-center gap-6 md:flex-nowrap md:justify-start items-center"
              style={{filter: 'brightness(100%)'}}
            >
              {footerLogos.map((logo: any, index: number) => {
                const img = (
                  <SanityImageClient
                    id={logo.image.asset._id}
                    alt={logo.image.alt || ''}
                    width={logo.image.asset.metadata?.dimensions?.width || 200}
                    height={logo.image.asset.metadata?.dimensions?.height || 80}
                    preview={logo.image.asset.metadata?.lqip}
                    className="h-10 w-auto object-contain"
                    mode="contain"
                  />
                )
                if (logo.link) {
                  return (
                    <a key={index} href={logo.link} target="_blank" rel="noopener noreferrer">
                      {img}
                    </a>
                  )
                }
                return <span key={index}>{img}</span>
              })}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-600 text-center text-sm text-gray-400">
          {copyright}
        </div>
      </div>
    </footer>
  )
}
