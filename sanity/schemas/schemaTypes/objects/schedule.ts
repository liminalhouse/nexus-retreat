import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const scheduleDay = defineType({
  name: 'scheduleDay',
  title: 'Schedule Day',
  type: 'object',
  fields: [
    defineField({
      name: 'dayTitle',
      title: 'Day Title',
      type: 'string',
      description: 'e.g., "DAY 1", "DAY 2", etc.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Schedule Items',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of activities/events for this day',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'dayTitle',
      items: 'items',
    },
    prepare({title, items}) {
      return {
        title: title || 'Untitled Day',
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})

export const schedule = defineType({
  name: 'schedule',
  title: 'Schedule',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading for the schedule section',
    }),
    defineField({
      name: 'topText',
      title: 'Top Text',
      type: 'text',
      description: 'Introduction text displayed above the schedule',
      rows: 4,
    }),
    defineField({
      name: 'days',
      title: 'Schedule Days',
      type: 'array',
      of: [{type: 'scheduleDay'}],
      description: 'Add schedule days (typically 3 columns)',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'bottomText',
      title: 'Bottom Text',
      type: 'text',
      description: 'Additional information displayed below the schedule',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      days: 'days',
    },
    prepare({heading, days}) {
      const dayCount = days?.length || 0
      return {
        title: heading || `Schedule (${dayCount} ${dayCount === 1 ? 'day' : 'days'})`,
        subtitle: 'Event Schedule',
      }
    },
  },
})
