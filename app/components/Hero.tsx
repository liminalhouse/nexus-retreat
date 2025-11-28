import {PortableText} from '@portabletext/react'
import {urlForImage} from '@/sanity/lib/utils'
import NexusLogo from './NexusLogo'
import Link from 'next/link'

interface HeroProps {
  block: {
    description?: any
    eventDate?: string
    eventLocation?: string
    ctaText?: string
    ctaLink?: string
    backgroundImage?: any
  }
  index: number
}

export default function Hero({block}: HeroProps) {
  const description = block?.description
  const eventDate = block?.eventDate || 'March 18-20'
  const eventLocation = block?.eventLocation || 'Boca Raton, FL'
  const ctaText = block?.ctaText
  const ctaLink = block?.ctaLink || '/register'
  const backgroundImage = block?.backgroundImage
  const backgroundImageUrl = backgroundImage
    ? urlForImage(backgroundImage)?.url()
    : '/images/hero-bg.jpg'

  return (
    <section className="relative h-[calc(100vh-0px)] flex items-center justify-center bg-nexus-navy">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-nexus-navy opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <div className="mb-6 flex justify-center">
          <NexusLogo className="w-60 max-w-md md:max-w-lg lg:max-w-xl" color="white" />
        </div>

        {description && (
          <div className="text-base md:text-lg leading-relaxed mb-12 max-w-3xl mx-auto prose prose-invert prose-a:text-blue-300 hover:prose-a:text-blue-200">
            <PortableText value={description} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm">
          {eventDate && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{eventDate}</span>
            </div>
          )}
          {eventLocation && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{eventLocation}</span>
            </div>
          )}
        </div>

        {/* TODO: Disable link for now */}
        {ctaText && (
          <div className="inline-block px-8 py-3 bg-nexus-coral text-gray-900 rounded transition-colors font-medium">
            {ctaText}
          </div>
        )}
      </div>
    </section>
  )
}
