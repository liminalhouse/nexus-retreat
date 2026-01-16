import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const speaker = defineType({
  name: 'speaker',
  title: 'Speaker',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'slug',
      description: 'Unique identifier for this speaker',
      options: {
        source: (doc) => `${doc.firstName || ''} ${doc.lastName || ''}`.trim(),
        maxLength: 120,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "Senior Engineer at Acme"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      title: 'title',
      media: 'profilePicture',
    },
    prepare({firstName, lastName, title, media}) {
      return {
        title: `${firstName || ''} ${lastName || ''}`.trim() || 'Unnamed Speaker',
        subtitle: title,
        media,
      }
    },
  },
})
