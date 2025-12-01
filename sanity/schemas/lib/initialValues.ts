import {FORM_DEFAULTS} from './formDefaults'

export const title = 'Nexus Retreat'

export const description = [
  {
    _key: '9f1a629887fd',
    _type: 'block',
    children: [
      {
        _key: '4a58edd077880',
        _type: 'span',
        marks: [],
        text: 'An invitation-only gathering for international sports leaders/',
      },
    ],
    markDefs: [],
    style: 'normal',
  },
]

export const ogImageTitle = 'Nexus Retreat'

// Initial value template for registration form
export const registrationFormInitialValue = () => ({
  _id: 'registrationFormContent',
  _type: 'registrationForm',
  ...FORM_DEFAULTS,
})
