import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      question: 'question',
      answer: 'answer',
    },
    prepare({question, answer}) {
      // Get first block of answer text for subtitle
      const answerText = answer?.[0]?.children?.[0]?.text || 'No answer provided'
      const truncatedAnswer = answerText.length > 60
        ? `${answerText.substring(0, 60)}...`
        : answerText

      return {
        title: question || 'Untitled question',
        subtitle: truncatedAnswer,
        media: HelpCircleIcon,
      }
    },
  },
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  description: 'Frequently Asked Questions section',
  type: 'object',
  icon: HelpCircleIcon,
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
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      faqBuilder: 'faqBuilder',
    },
    prepare({faqBuilder}) {
      const count = faqBuilder?.length || 0
      const firstQuestion = faqBuilder?.[0]?.question || 'No questions yet'

      return {
        title: 'FAQ Section',
        subtitle: count === 1
          ? `1 question: ${firstQuestion}`
          : count > 1
          ? `${count} questions: ${firstQuestion}, ...`
          : 'No questions added',
        media: HelpCircleIcon,
      }
    },
  },
})
