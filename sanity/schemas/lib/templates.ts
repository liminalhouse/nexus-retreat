import {type Template} from 'sanity'
import {FORM_DEFAULTS} from './formDefaults'

/**
 * Initial value templates for Sanity documents
 * These templates can be used to create new documents with pre-populated values
 * or to reset existing documents to their default state
 */

export const templates: Template[] = [
  {
    id: 'registrationFormContent',
    title: 'Registration Form Content',
    schemaType: 'registrationForm',
    value: () => ({
      _id: 'registrationFormContent',
      _type: 'registrationForm',
      ...FORM_DEFAULTS,
    }),
  },
]
