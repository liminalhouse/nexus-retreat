import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const infoSection = defineType({
  name: 'infoSection',
  title: 'Info Section',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'styleType',
      title: 'Style Type',
      type: 'string',
      description: 'Choose the background color style for this section',
      options: {
        list: [
          {title: 'Beige (Default)', value: 'beige'},
          {title: 'White', value: 'white'},
          {title: 'Seafoam', value: 'seafoam'},
          {title: 'Coral', value: 'coral'},
          {title: 'Navy', value: 'navy'},
        ],
        layout: 'radio',
      },
      initialValue: 'beige',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
      styleType: 'styleType',
    },
    prepare({title, styleType}) {
      return {
        title: title || 'Untitled Info Section',
        subtitle: `Info Section • ${styleType || 'beige'}`,
      }
    },
  },
})
