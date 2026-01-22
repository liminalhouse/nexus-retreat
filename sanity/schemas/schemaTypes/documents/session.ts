import {defineField, defineType, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

const sessionTypes = [
  {title: 'Keynote', value: 'keynote'},
  {title: 'Panel', value: 'panel'},
  {title: 'Lightning talk', value: 'lightning-talk'},
  {title: 'Social', value: 'social'},
  {title: 'Meal', value: 'meal'},
  {title: 'Activity', value: 'activity'},
]

const sessionTags = [
  {title: 'Geopolitics', value: 'geopolitics'},
  {title: 'International Finance & Economics', value: 'international-finance-economics'},
  {title: 'Future of Cities', value: 'future-of-cities'},
  {title: 'AI & Tech', value: 'ai-tech'},
  {title: 'Dinner Speakers', value: 'dinner-speakers'},
  {title: 'Health & Wellness', value: 'health-wellness'},
  {title: 'Surprise & Delight', value: 'surprise-delight'},
]

export const session = defineType({
  name: 'session',
  title: 'Session',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'slug',
      description: 'Unique identifier for this session',
      options: {
        source: 'title',
        maxLength: 120,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Public-facing session title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'datetime',
      validation: (Rule) =>
        Rule.required().custom((startTime, context) => {
          const endTime = (context.document as {endTime?: string})?.endTime
          if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            return 'Start time must be before end time'
          }
          return true
        }),
    }),
    defineField({
      name: 'endTime',
      title: 'End Time',
      type: 'datetime',
      validation: (Rule) =>
        Rule.required().custom((endTime, context) => {
          const startTime = (context.document as {startTime?: string})?.startTime
          if (endTime && startTime && new Date(endTime) <= new Date(startTime)) {
            return 'End time must be after start time'
          }
          return true
        }),
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'speaker'}],
        }),
      ],
    }),
    defineField({
      name: 'sessionType',
      title: 'Session Type',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: sessionTypes,
      },
    }),
    defineField({
      name: 'sessionTags',
      title: 'Session Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: sessionTags,
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      id: 'id.current',
      startTime: 'startTime',
      speaker0: 'speakers.0.firstName',
      speaker1: 'speakers.1.firstName',
      media: 'photo',
    },
    prepare({title, id, startTime, speaker0, speaker1, media}) {
      const speakerNames = [speaker0, speaker1].filter(Boolean)
      const speakerText =
        speakerNames.length > 0 ? speakerNames.join(', ') + (speaker1 ? '...' : '') : 'No speakers'

      const dateText = startTime
        ? new Date(startTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : ''

      return {
        title: title || id,
        subtitle: `${dateText} | ${speakerText}`,
        media,
      }
    },
  },
})
