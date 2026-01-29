import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as initialValues from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'registrationIsLive',
      title: 'Registration is Live',
      type: 'boolean',
      description: 'Toggle to enable/disable registration form access for the entire site',
      initialValue: false,
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'title',
      description: 'Site title used for SEO and metadata.',
      title: 'Site Title',
      type: 'string',
      initialValue: initialValues.title,
      validation: (rule) => rule.required(),
      group: 'seo',
    }),
    defineField({
      name: 'description',
      description: 'Used for SEO metadata',
      title: 'Site Description',
      type: 'array',
      initialValue: initialValues.description,
      group: 'seo',
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      group: 'seo',
      options: {
        hotspot: true,
        // TODO: Do we need Assist?
        // aiAssist: {
        //   imageDescriptionField: 'alt',
        // },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    // Navigation Settings
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      group: 'navigation',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'highlighted',
              title: 'Highlighted Button',
              type: 'boolean',
              description: 'Show this link as a highlighted button',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        }),
      ],
    }),
    // Footer Settings
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      initialValue: 'George Pyne • Jay Penske',
      group: 'footer',
    }),
    defineField({
      name: 'footerEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'nexus-retreat@gmail.com',
      validation: (rule) => rule.email(),
      group: 'footer',
    }),
    defineField({
      name: 'footerQuickLinks',
      title: 'Quick Links',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Copyright Text',
      type: 'string',
      initialValue: 'Copyright © Bruin Capital Holdings, LLC 2025. All rights reserved.',
      group: 'footer',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
