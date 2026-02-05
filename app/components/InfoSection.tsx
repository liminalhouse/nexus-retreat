import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import {InfoSection} from '@/sanity.types'

type InfoProps = {
  block: InfoSection
  index: number
}

const styleConfig = {
  beige: {
    bg: 'bg-nexus-beige',
    heading: 'text-nexus-navy',
    subheading: 'text-nexus-navy/70',
    content:
      'text-gray-700 [&_li]:marker:text-gray-700 [&_a]:text-gray-700 [&_a]:underline [&_strong]:text-gray-700 [&_b]:text-gray-700',
  },
  white: {
    bg: 'bg-white',
    heading: 'text-nexus-navy',
    subheading: 'text-nexus-navy/70',
    content:
      'text-nexus-navy/70 [&_li]:marker:text-nexus-navy/70 [&_a]:text-nexus-navy/70 [&_a]:underline [&_strong]:text-nexus-navy/70 [&_b]:text-nexus-navy/70',
  },
  seafoam: {
    bg: 'bg-nexus-seafoam/50',
    heading: 'text-nexus-navy',
    subheading: 'text-nexus-navy/70',
    content:
      'text-gray-800 [&_li]:marker:text-gray-800 [&_a]:text-gray-800 [&_a]:underline [&_strong]:text-gray-800 [&_b]:text-gray-800',
  },
  coral: {
    bg: 'bg-nexus-coral/15',
    heading: 'text-nexus-navy-dark',
    subheading: 'text-nexus-navy-dark/70',
    content:
      'text-gray-800 [&_li]:marker:text-gray-800 [&_a]:text-gray-800 [&_a]:underline [&_strong]:text-gray-800 [&_b]:text-gray-800',
  },
  navy: {
    bg: 'bg-nexus-navy',
    heading: 'text-white',
    subheading: 'text-white/70',
    content:
      'text-gray-200 [&_li]:marker:text-gray-200 [&_a]:text-gray-200 [&_a]:underline [&_strong]:text-gray-200 [&_b]:text-gray-200',
  },
} as const

export default function InfoSectionBlock({block}: InfoProps) {
  const styleType = block?.styleType || 'beige'
  const styles = styleConfig[styleType as keyof typeof styleConfig] || styleConfig.beige

  return (
    <section className={`py-16 md:py-24 ${styles.bg}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {block?.heading && (
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-semibold font-serif mb-4 text-center ${styles.heading}`}
            >
              {block.heading}
            </h2>
          )}
          {block?.subheading && (
            <p className={`text-lg md:text-xl mb-8 ${styles.subheading}`}>{block.subheading}</p>
          )}
          {block?.content?.length && (
            <div className={`prose prose-lg max-w-none ${styles.content}`}>
              <PortableText value={block.content as PortableTextBlock[]} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
