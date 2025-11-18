import {page} from './documents/page'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {hero} from './objects/hero'
import {faq, faqItem} from './objects/faq'
import {formBuilder, fieldGroup, formField} from './objects/formBuilder'
import {form} from './objects/form'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
  hero,
  faqItem,
  faq,
  formBuilder,
  fieldGroup,
  formField,
  form,
]
