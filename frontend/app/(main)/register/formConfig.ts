import {COUNTRIES} from '@/lib/constants/countries'
import type {FormConfig} from '../components/Form/types'

export const registrationFormConfig: FormConfig = {
  title: 'Register for the Retreat',
  subtitle: 'HOSTED BY GEORGE PYNE AND JAY PENSKE',
  description: 'March 18-20, 2026',
  numberOfSteps: 3,
  submitEndpoint: '/api/registration',
  submitButtonText: 'REGISTER',
  nextButtonText: 'NEXT',
  backButtonText: '← BACK',
  successMessage: 'Thank you for registering! We look forward to seeing you at the retreat.',

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
          },
          {
            fieldType: 'text',
            name: 'state',
            label: 'State / Province / County',
            placeholder: 'Your region (i.e. California, Ontario, etc.)',
          },
          {
            fieldType: 'text',
            name: 'zip',
            label: 'Zip / Postal Code',
            placeholder: 'Zip or postal code',
          },
          {
            fieldType: 'select',
            name: 'country',
            label: 'Country',
            placeholder: 'Select a country...',
            options: COUNTRIES.map((country) => ({
              label: country,
              value: country,
            })),
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
          'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19. Please share which nights you will be staying with us.',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'accommodations',
            options: [
              {label: 'I will use my complimentary room the night of March 18', value: 'march_18'},
              {label: 'I will use my complimentary room the night of March 19', value: 'march_19'},
            ],
          },
        ],
      },
      {
        groupTitle: 'Dinner Attendance',
        groupDescription:
          'Which nights will you attend dinner? Please note both dinners have keynote speakers.',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'dinner_attendance',
            options: [
              {label: 'I will attend the Dinner on March 18', value: 'march_18'},
              {label: 'I will attend the Dinner on March 19', value: 'march_19'},
            ],
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
            options: [
              {
                label: 'Pickleball tournament (sunrise / downriver style) on March 19',
                value: 'pickleball',
              },
              {label: 'Golf - Full round', value: 'golf_full'},
              {label: 'Golf - 9 holes', value: 'golf_9'},
              {label: 'Golf - Drive, Chip, and Putt contest', value: 'golf_drive_chip_putt'},
              {label: 'Tennis', value: 'tennis'},
              {label: 'March 19 morning yoga', value: 'yoga_march_19'},
              {label: 'March 19 morning bootcamp', value: 'bootcamp_march_19'},
              {label: 'March 20 morning yoga', value: 'yoga_march_20'},
              {label: 'March 20 morning bootcamp', value: 'bootcamp_march_20'},
              {
                label: "Please don't bother me, I'll be at the spa :)",
                value: 'spa',
              },
            ],
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
          'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19. Please share which nights your guest will be staying with us.',
        showIfFieldHasValue: ['guest_name', 'guest_email'],
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'accommodations',
            options: [
              {
                label: 'My guest will use a complimentary room the night of March 18',
                value: 'march_18',
              },
              {
                label: 'My guest will use a complimentary room the night of March 19',
                value: 'march_19',
              },
            ],
          },
        ],
      },
      {
        groupTitle: 'Guest Dinner Attendance',
        groupDescription:
          'Which nights will your guest attend dinner? Please note both dinners have keynote speakers.',
        showIfFieldHasValue: ['guest_name', 'guest_email'],
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'dinner_attendance',
            options: [
              {label: 'My guest will attend the Dinner on March 18', value: 'march_18'},
              {label: 'My guest will attend the Dinner on March 19', value: 'march_19'},
            ],
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
            options: [
              {
                label: 'Pickleball tournament (sunrise / downriver style) on March 19',
                value: 'pickleball',
              },
              {label: 'Golf - Full round', value: 'golf_full'},
              {label: 'Golf - 9 holes', value: 'golf_9'},
              {label: 'Golf - Drive, Chip, and Putt contest', value: 'golf_drive_chip_putt'},
              {label: 'Tennis', value: 'tennis'},
              {label: 'March 19 morning yoga', value: 'yoga_march_19'},
              {label: 'March 19 morning bootcamp', value: 'bootcamp_march_19'},
              {label: 'March 20 morning yoga', value: 'yoga_march_20'},
              {label: 'March 20 morning bootcamp', value: 'bootcamp_march_20'},
              {
                label: 'My guest will be at the spa :)',
                value: 'spa',
              },
            ],
          },
        ],
      },
    ],
  },
}
