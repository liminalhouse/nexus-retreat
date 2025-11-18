import {defineField, defineType} from 'sanity'

export const registrationForm = defineType({
  name: 'registrationForm',
  title: 'Registration Form',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      description: 'The main title displayed on the registration form',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Form Subtitle',
      type: 'string',
      description: 'Subtitle or tagline (e.g., "HOSTED BY GEORGE PYNE AND JAY PENSKE")',
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'string',
      description: 'Event date to display (e.g., "March 18-20, 2026")',
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
      initialValue: 3,
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
          initialValue: 'Personal Details',
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
      hidden: ({parent}) => (parent?.numberOfSteps || 3) < 2,
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          initialValue: 'Emergency & Contact Information',
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
      hidden: ({parent}) => (parent?.numberOfSteps || 3) < 3,
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          initialValue: 'Event Details',
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
      initialValue: 'REGISTER',
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
      name: 'backToHomeText',
      title: 'Back to Home Text',
      type: 'string',
      initialValue: 'BACK TO HOME',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      description: 'Message shown after successful form submission',
      initialValue: 'Thank you for registering! We look forward to seeing you at the retreat.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
    },
    prepare({title, eventDate}) {
      return {
        title: title || 'Registration Form',
        subtitle: eventDate || 'No date set',
      }
    },
  },
})
