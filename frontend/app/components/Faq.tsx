import {PortableText} from '@portabletext/react'

interface FaqProps {
  block: {
    faqBuilder: {
      question?: string
      answer?: any
    }[]
  }
}

export default function Faq({block}: FaqProps) {
  console.log('faqBuilder ', block.faqBuilder)
  return (
    <section className="py-12 bg-nexus-beige h-full">
      <div className="container mx-auto">
        <div className="space-y-4">
          {block.faqBuilder.map((faq, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg pb-2 border-b border-gray-100">
                {faq.question}
              </h3>
              <div className="mt-2">
                <PortableText value={faq.answer} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
