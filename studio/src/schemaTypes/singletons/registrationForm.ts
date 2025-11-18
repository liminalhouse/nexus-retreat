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
      name: 'formBuilder',
      title: 'Registration Form Steps',
      type: 'formBuilder',
      description: 'Build your multi-step registration form',
      validation: (Rule) => Rule.required(),
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
