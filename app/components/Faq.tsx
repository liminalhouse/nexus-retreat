'use client'

import CustomPortableText from '@/app/components/PortableText'

interface FaqProps {
  block: {
    faqBuilder: {
      question?: string
      answer?: any
    }[]
    _key: string
  }
}

export default function Faq({block}: FaqProps) {
  return (
    <section className="py-12 bg-nexus-beige h-full">
      <div className="container mx-auto">
        <div className="space-y-4 hs-accordion-group" id={`faq-${block._key}`}>
          {block.faqBuilder.map((faq, index) => (
            <div
              key={index}
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
                  <CustomPortableText value={faq.answer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
