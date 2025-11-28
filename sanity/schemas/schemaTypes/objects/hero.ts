import {defineField, defineType} from 'sanity'

/**
 * Hero schema object. Used for hero sections on pages.
 */

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Rich text description with support for links',
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'string',
      initialValue: 'March 18-20',
    }),
    defineField({
      name: 'eventLocation',
      title: 'Event Location',
      type: 'string',
      initialValue: 'Boca Raton, FL',
    }),
    defineField({
      name: 'ctaText',
      title: 'Call to Action Button Text',
      type: 'string',
      initialValue: 'Register Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call to Action Button Link',
      type: 'string',
      initialValue: '/register',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
