import {defineArrayMember, defineField, defineType} from 'sanity'

// Individual form field types
export const formField = defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          {title: 'Text Input', value: 'text'},
          {title: 'Email Input', value: 'email'},
          {title: 'Phone Input', value: 'tel'},
          {title: 'Textarea', value: 'textarea'},
          {title: 'Select Dropdown', value: 'select'},
          {title: 'Checkbox', value: 'checkbox'},
          {title: 'Checkbox Group', value: 'checkboxGroup'},
          {title: 'Radio Group', value: 'radio'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The label displayed for this field',
    }),
    defineField({
      name: 'name',
      title: 'Field Name',
      type: 'string',
      description: 'Unique identifier for this field (used for form submission)',
      validation: (Rule) =>
        Rule.required().custom((name) => {
          // Check for valid field name format
          if (name && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
            return 'Field name must start with a letter and contain only letters, numbers, and underscores'
          }
          return true
        }),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      description: 'Placeholder text shown inside the input',
      hidden: ({parent}) =>
        !['text', 'email', 'tel', 'textarea', 'select'].includes(parent?.fieldType || ''),
    }),
    defineField({
      name: 'helperText',
      title: 'Helper Text',
      type: 'text',
      description: 'Additional help text displayed below the field',
      rows: 2,
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      description: 'Is this field required?',
      initialValue: false,
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Option Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Option Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
      hidden: ({parent}) =>
        !['select', 'checkboxGroup', 'radio'].includes(parent?.fieldType || ''),
      validation: (Rule) =>
        Rule.custom((options, context) => {
          const parent = context.parent as any
          if (['select', 'checkboxGroup', 'radio'].includes(parent?.fieldType)) {
            if (!options || options.length === 0) {
              return 'At least one option is required for this field type'
            }
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      fieldType: 'fieldType',
      required: 'required',
    },
    prepare({label, fieldType, required}) {
      const typeLabels: Record<string, string> = {
        text: '📝 Text',
        email: '📧 Email',
        tel: '📞 Phone',
        textarea: '📄 Textarea',
        select: '📋 Select',
        checkbox: '☑️ Checkbox',
        checkboxGroup: '☑️ Checkbox Group',
        radio: '🔘 Radio',
      }
      return {
        title: label || 'Untitled Field',
        subtitle: `${typeLabels[fieldType] || fieldType}${required ? ' (Required)' : ''}`,
      }
    },
  },
})

// Field group - a group of fields with a title
export const fieldGroup = defineType({
  name: 'fieldGroup',
  title: 'Field Group',
  type: 'object',
  fields: [
    defineField({
      name: 'groupTitle',
      title: 'Group Title',
      type: 'string',
      description: 'Title for this group of fields',
    }),
    defineField({
      name: 'groupDescription',
      title: 'Group Description',
      type: 'text',
      description: 'Optional description for this group',
      rows: 2,
    }),
    defineField({
      name: 'fields',
      title: 'Fields',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'formField',
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'groupTitle',
      fields: 'fields',
    },
    prepare({title, fields}) {
      const fieldsCount = fields?.length || 0
      return {
        title: title || 'Untitled Group',
        subtitle: `${fieldsCount} field${fieldsCount !== 1 ? 's' : ''}`,
      }
    },
  },
})

// Main form builder with exactly 3 steps
export const formBuilder = defineType({
  name: 'formBuilder',
  title: 'Form Builder',
  type: 'object',
  fields: [
    defineField({
      name: 'step1',
      title: 'Step 1',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          description: 'Title for Step 1',
          initialValue: 'Personal Details',
        }),
        defineField({
          name: 'fieldGroups',
          title: 'Field Groups',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'fieldGroup',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'step2',
      title: 'Step 2',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          description: 'Title for Step 2',
          initialValue: 'Emergency & Contact Information',
        }),
        defineField({
          name: 'fieldGroups',
          title: 'Field Groups',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'fieldGroup',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'step3',
      title: 'Step 3',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Step Title',
          type: 'string',
          description: 'Title for Step 3',
          initialValue: 'Event Details',
        }),
        defineField({
          name: 'fieldGroups',
          title: 'Field Groups',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'fieldGroup',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Form Builder',
        subtitle: '3 steps',
      }
    },
  },
})
