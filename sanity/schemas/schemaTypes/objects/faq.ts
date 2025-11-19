import {defineArrayMember, defineField, defineType} from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'blockContent',
    }),
  ],
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  description: 'Frequently Asked Questions section',
  type: 'object',
  fields: [
    defineField({
      name: 'faqBuilder',
      type: 'array',
      title: 'FAQ builder',
      of: [
        defineArrayMember({
          name: 'faqItems',
          type: 'faqItem',
          title: 'FAQ item',
        }),
      ],
    }),
  ],
})
