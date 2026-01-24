import {page} from './documents/page'
import {emailTemplate} from './documents/emailTemplate'
import {speaker} from './documents/speaker'
import {session} from './documents/session'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {registrationForm} from './singletons/registrationForm'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {hero} from './objects/hero'
import {faq, faqItem} from './objects/faq'
import {formBuilder, fieldGroup, formField} from './objects/formBuilder'
import {form} from './objects/form'
import {schedule, scheduleDay} from './objects/schedule'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  registrationForm,
  // Documents
  page,
  emailTemplate,
  speaker,
  session,
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
  scheduleDay,
  schedule,
]
