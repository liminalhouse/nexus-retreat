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
      name: 'numberOfSteps',
      title: 'Number of Steps',
      type: 'number',
      description: 'How many steps should this form have?',
      options: {
        list: [
          {title: '1 Step (Single Page)', value: 1},
          {title: '2 Steps', value: 2},
          {title: '3 Steps', value: 3},
        ],
      },
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: 'step1',
      title: 'Step 1',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          initialValue: 'Step 1',
        }),
        defineField({
          name: 'fieldGroups',
          title: 'Field Groups',
          type: 'array',
          of: [{type: 'fieldGroup'}],
        }),
      ],
    }),
    defineField({
      name: 'step2',
      title: 'Step 2',
      type: 'object',
      hidden: ({parent}) => (parent?.numberOfSteps || 1) < 2,
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          initialValue: 'Step 2',
        }),
        defineField({
          name: 'fieldGroups',
          title: 'Field Groups',
          type: 'array',
          of: [{type: 'fieldGroup'}],
        }),
      ],
    }),
    defineField({
      name: 'step3',
      title: 'Step 3',
      type: 'object',
      hidden: ({parent}) => (parent?.numberOfSteps || 1) < 3,
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          initialValue: 'Step 3',
        }),
        defineField({
          name: 'fieldGroups',
          title: 'Field Groups',
          type: 'array',
          of: [{type: 'fieldGroup'}],
        }),
      ],
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
