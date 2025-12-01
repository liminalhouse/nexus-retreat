'use client'

import {useRef, useEffect} from 'react'
import {type PortableTextBlock} from 'next-sanity'
import CustomPortableText from '@/app/components/PortableText'
import type {FaqItem} from '@/sanity.types'

interface FaqProps {
  block: {
    faqBuilder: FaqItem[]
    _key: string
  }
}

export default function Faq({block}: FaqProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const accordionGroup = document.getElementById(`faq-${block._key}`)
    if (!accordionGroup) return

    const handleAccordionClick = (event: Event) => {
      const button = (event.target as HTMLElement).closest('.hs-accordion-toggle')
      if (!button) return

      const accordionItem = button.closest('.hs-accordion')
      const index = itemRefs.current.findIndex((ref) => ref === accordionItem)

      if (index !== -1) {
        setTimeout(() => {
          const element = itemRefs.current[index]
          if (element) {
            const yOffset = -80
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset

            window.scrollTo({
              top: y,
              behavior: 'smooth',
            })
          }
        }, 350)
      }
    }

    accordionGroup.addEventListener('click', handleAccordionClick)

    return () => {
      accordionGroup.removeEventListener('click', handleAccordionClick)
    }
  }, [block._key])

  return (
    <section className="py-12 bg-nexus-beige h-full">
      <div className="container mx-auto">
        <div className="space-y-4 hs-accordion-group" id={`faq-${block._key}`}>
          {block.faqBuilder.map((faq, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className="hs-accordion bg-white p-4 rounded shadow"
              id={`faq-item-${block._key}-${index}`}
            >
              <button
                type="button"
                className="hs-accordion-toggle hs-accordion-active:text-nexus-navy py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:text-gray-500 rounded-lg cursor-pointer"
                aria-expanded="false"
                aria-controls={`hs-collapse-${block._key}-${index}`}
              >
                <svg
                  className="hs-accordion-active:hidden block size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <svg
                  className="hs-accordion-active:block hidden size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
                {faq.question}
              </button>
              <div
                id={`hs-collapse-${block._key}-${index}`}
                className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby={`faq-item-${block._key}-${index}`}
              >
                <div className="pb-4 px-6">
                  {faq.answer && <CustomPortableText value={faq.answer as PortableTextBlock[]} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
