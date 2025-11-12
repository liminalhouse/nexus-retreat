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
    <section className="py-12 bg-gray-100 h-full">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {block.faqBuilder.map((faq, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{faq.question}</h3>
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
