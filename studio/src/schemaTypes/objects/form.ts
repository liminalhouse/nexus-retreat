import {defineField, defineType} from 'sanity'

export const form = defineType({
  name: 'form',
  title: 'Form',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      description: 'The main title displayed on the form',
    }),
    defineField({
      name: 'subtitle',
      title: 'Form Subtitle',
      type: 'string',
      description: 'Subtitle or tagline (e.g., "HOSTED BY GEORGE PYNE AND JAY PENSKE")',
    }),
    defineField({
      name: 'description',
      title: 'Form Description',
      type: 'text',
      description: 'Optional description shown below the title',
      rows: 3,
    }),
    defineField({
      name: 'formBuilder',
      title: 'Form Steps',
      type: 'formBuilder',
      description: 'Build your multi-step form (3 steps)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'SUBMIT',
    }),
    defineField({
      name: 'nextButtonText',
      title: 'Next Button Text',
      type: 'string',
      initialValue: 'NEXT',
    }),
    defineField({
      name: 'backButtonText',
      title: 'Back Button Text',
      type: 'string',
      initialValue: 'BACK',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      description: 'Message shown after successful form submission',
      initialValue: 'Thank you for your submission!',
    }),
    defineField({
      name: 'submitEndpoint',
      title: 'Submit Endpoint',
      type: 'string',
      description: 'API endpoint to submit the form data to (e.g., /api/registration, /api/contact)',
      initialValue: '/api/form-submission',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Untitled Form',
        subtitle: subtitle || 'Form',
      }
    },
  },
})
