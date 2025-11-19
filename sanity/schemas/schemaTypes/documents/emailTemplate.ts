import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const emailTemplate = defineType({
  name: 'emailTemplate',
  title: 'Email Template',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Template Name',
      type: 'string',
      description: 'Internal name for this template',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Email Type',
      type: 'string',
      options: {
        list: [
          {title: 'Registration Confirmation', value: 'registration_confirmation'},
          // TODO: Add more email types as needed
          // {title: 'Event Reminder', value: 'event_reminder'},
          // {title: 'Event Update', value: 'event_update'},
          // {title: 'Welcome Email', value: 'welcome'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subject',
      title: 'Email Subject',
      type: 'string',
      description: 'The subject line of the email',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerImage',
      title: 'Header Image',
      type: 'image',
      description: 'Optional image to display at the top of the email',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and email clients that block images',
        },
      ],
    }),
    defineField({
      name: 'greeting',
      title: 'Greeting',
      type: 'text',
      rows: 2,
      description: 'The opening greeting of the email (e.g., "Dear {{firstName}},")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bodyIntro',
      title: 'Body Introduction',
      type: 'array',
      of: [{type: 'block'}],
      description:
        'Text that appears before any dynamic content. Use {{variableName}} for dynamic values.',
    }),
    defineField({
      name: 'bodyOutro',
      title: 'Body Closing',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text that appears after any dynamic content',
    }),
    defineField({
      name: 'signature',
      title: 'Email Signature',
      type: 'text',
      rows: 4,
      description: 'The closing signature of the email',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Only active templates will be used',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      type: 'type',
      active: 'isActive',
    },
    prepare({title, type, active}) {
      return {
        title: title,
        subtitle: `${type?.replace('_', ' ').toUpperCase()} ${active ? '✓' : '(Inactive)'}`,
      }
    },
  },
})
