import {COUNTRIES} from '@/lib/constants/countries'
import type {FormConfig} from '@/app/components/Form/types'
import {
  ACCOMMODATION_OPTIONS,
  GUEST_ACCOMMODATION_OPTIONS,
  DINNER_OPTIONS,
  GUEST_DINNER_OPTIONS,
  ACTIVITY_OPTIONS,
  GUEST_ACTIVITY_OPTIONS,
} from '@/lib/utils/formatRegistrationFields'

/**
 * Base registration form configuration
 * This contains the structure and field names that won't change.
 * Text content (labels, placeholders, etc.) will be merged from Sanity CMS.
 */
export const registrationFormConfig: Omit<
  FormConfig,
  | 'title'
  | 'subtitle'
  | 'description'
  | 'submitButtonText'
  | 'nextButtonText'
  | 'backButtonText'
  | 'successMessage'
> = {
  numberOfSteps: 3,
  submitEndpoint: '/api/registration',

  // Step 1: Personal Details
  step1: {
    title: 'Personal Details',
    fieldGroups: [
      {
        fields: [
          {
            fieldType: 'email',
            name: 'email',
            label: 'Email Address',
            placeholder: 'Your email address',
            helperText: 'This should be the email you receive your invitation from.',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'first_name',
            label: 'First name',
            placeholder: 'First name',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'last_name',
            label: 'Last name',
            placeholder: 'Last name',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'title',
            label: 'Title',
            placeholder: 'Your title or position',
          },
          {
            fieldType: 'text',
            name: 'organization',
            label: 'Organization',
            placeholder: 'Your company or organization name',
          },
          {
            fieldType: 'tel',
            name: 'mobile_phone',
            label: 'Mobile Phone',
            placeholder: 'Your phone number',
            required: true,
          },
        ],
      },
      {
        groupTitle: 'Work Address',
        fields: [
          {
            fieldType: 'text',
            name: 'address_line_1',
            label: 'Address Line 1',
            placeholder: 'Address line 1',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'address_line_2',
            label: 'Address Line 2',
            placeholder: 'Address line 2',
          },
          {
            fieldType: 'text',
            name: 'city',
            label: 'City',
            placeholder: 'City',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'state',
            label: 'State / Province / County',
            placeholder: 'Your region (i.e. California, Ontario, etc.)',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'zip',
            label: 'Zip / Postal Code',
            placeholder: 'Zip or postal code',
            required: true,
          },
          {
            fieldType: 'select',
            name: 'country',
            label: 'Country',
            placeholder: 'Select a country...',
            defaultValue: 'United States',
            options: COUNTRIES.map((country) => ({
              label: country,
              value: country,
            })),
            required: true,
          },
        ],
      },
    ],
  },

  // Step 2: Emergency & Contact Information
  step2: {
    title: 'Emergency & Contact Information',
    fieldGroups: [
      {
        groupTitle: 'Emergency Contact',
        groupDescription:
          'Please provide a contact in case of emergency while you are with us at the Retreat.',
        fields: [
          {
            fieldType: 'text',
            name: 'emergency_contact_name',
            label: 'Emergency Contact Name',
            placeholder: "Your emergency contact's full name",
            required: true,
          },
          {
            fieldType: 'text',
            name: 'emergency_contact_relation',
            label: 'Emergency Contact Relation',
            placeholder: 'Your relation to the emergency contact (optional)',
            required: false,
          },
          {
            fieldType: 'email',
            name: 'emergency_contact_email',
            label: 'Emergency Contact Email',
            placeholder: "Your emergency contact's email",
            required: true,
          },
          {
            fieldType: 'tel',
            name: 'emergency_contact_phone',
            label: 'Emergency Contact Phone',
            placeholder: "Your emergency contact's phone number",
            required: true,
          },
        ],
      },
      {
        groupTitle: 'Executive Assistant Point of Contact',
        groupDescription:
          'All emails and communication regarding this event will also be sent to this email.',
        fields: [
          {
            fieldType: 'text',
            name: 'assistant_name',
            label: 'Name',
            placeholder: "Your assistant's full name",
          },
          {
            fieldType: 'text',
            name: 'assistant_title',
            label: 'Title',
            placeholder: "Your assistant's title",
          },
          {
            fieldType: 'email',
            name: 'assistant_email',
            label: 'Email',
            placeholder: "Your assistant's email",
          },
          {
            fieldType: 'tel',
            name: 'assistant_phone',
            label: 'Phone',
            placeholder: "Your assistant's phone number",
          },
        ],
      },
      {
        groupTitle: 'Guest Information',
        groupDescription:
          'If you are bringing a partner or spouse, please provide their information below.',
        fields: [
          {
            fieldType: 'text',
            name: 'guest_name',
            label: 'Guest name',
            placeholder: 'Full name of your guest',
          },
          {
            fieldType: 'text',
            name: 'guest_relation',
            label: 'Relation to you',
            placeholder: 'e.g., spouse, partner, friend',
          },
          {
            fieldType: 'email',
            name: 'guest_email',
            label: 'Guest email',
            placeholder: "Your guest's email address",
          },
        ],
      },
    ],
  },

  // Step 3: Event Details
  step3: {
    title: 'Event Details',
    fieldGroups: [
      {
        groupTitle: 'Your Event Details',
        fields: [
          {
            fieldType: 'textarea',
            name: 'dietary_restrictions',
            label: 'Dietary Restrictions or Allergies',
            placeholder: 'e.g., vegetarian, gluten-free, nut allergy',
          },
          {
            fieldType: 'select',
            name: 'jacket_size',
            label: 'What is your jacket size?',
            placeholder: 'Select size',
            options: [
              {label: 'XS', value: 'XS'},
              {label: 'S', value: 'S'},
              {label: 'M', value: 'M'},
              {label: 'L', value: 'L'},
              {label: 'XL', value: 'XL'},
              {label: 'XXL', value: 'XXL'},
            ],
          },
        ],
      },
      {
        groupTitle: 'Accommodations',
        groupDescription:
          'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'accommodations',
            label: 'Which nights will you be staying with us?',
            options: ACCOMMODATION_OPTIONS,
          },
        ],
      },
      {
        groupTitle: 'Dinner Attendance',
        groupDescription: 'Please note both dinners have keynote speakers.',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'dinner_attendance',
            label: 'Which nights will you attend dinner?',
            options: DINNER_OPTIONS,
          },
        ],
      },
      {
        groupTitle: 'Activities',
        groupDescription:
          'These are optional activities available during the retreat. Please select any that interest you.',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'activities',
            label: 'What activities are you interested in joining?',
            options: ACTIVITY_OPTIONS,
          },
        ],
      },
      {
        groupTitle: "Your Guest's Event Details",
        showIfFieldHasValue: ['guest_name', 'guest_email'],
        fields: [
          {
            fieldType: 'textarea',
            name: 'guest_dietary_restrictions',
            label: 'Dietary Restrictions or Allergies',
            placeholder: 'e.g., vegetarian, gluten-free, nut allergy',
          },
          {
            fieldType: 'select',
            name: 'guest_jacket_size',
            label: "What is your guest's jacket size?",
            placeholder: 'Select size',
            options: [
              {label: 'XS', value: 'XS'},
              {label: 'S', value: 'S'},
              {label: 'M', value: 'M'},
              {label: 'L', value: 'L'},
              {label: 'XL', value: 'XL'},
              {label: 'XXL', value: 'XXL'},
            ],
          },
        ],
      },
      {
        groupTitle: 'Guest Accommodations',
        groupDescription:
          'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
        showIfFieldHasValue: ['guest_name', 'guest_email'],
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'guest_accommodations',
            label: 'Which nights will your guest be staying with us?',
            options: GUEST_ACCOMMODATION_OPTIONS,
          },
        ],
      },
      {
        groupTitle: 'Guest Dinner Attendance',
        groupDescription: 'Please note both dinners have keynote speakers.',
        showIfFieldHasValue: ['guest_name', 'guest_email'],
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'guest_dinner_attendance',
            label: 'Which nights will your guest attend dinner?',
            options: GUEST_DINNER_OPTIONS,
          },
        ],
      },
      {
        groupTitle: 'Guest Activities',
        groupDescription:
          'These are optional activities available during the retreat. Please select any that interest your guest.',
        showIfFieldHasValue: ['guest_name', 'guest_email'],
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'guest_activities',
            label: 'What activities is your guest interested in joining?',
            options: GUEST_ACTIVITY_OPTIONS,
          },
        ],
      },
    ],
  },
}
