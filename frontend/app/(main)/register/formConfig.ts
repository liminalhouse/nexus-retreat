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
            placeholder: 'your@email.com',
            helperText: 'This should be the email you receive your invitation from.',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'first_name',
            label: 'First Name',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'last_name',
            label: 'Last Name',
            required: true,
          },
          {
            fieldType: 'text',
            name: 'title',
            label: 'Title',
          },
          {
            fieldType: 'text',
            name: 'organization',
            label: 'Organization',
          },
          {
            fieldType: 'tel',
            name: 'mobile_phone',
            label: 'Mobile Phone',
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
          },
          {
            fieldType: 'text',
            name: 'address_line_2',
            label: 'Address Line 2',
          },
          {
            fieldType: 'text',
            name: 'city',
            label: 'City',
          },
          {
            fieldType: 'text',
            name: 'state',
            label: 'State / Province / County',
          },
          {
            fieldType: 'text',
            name: 'zip',
            label: 'Zip / Postal Code',
          },
          {
            fieldType: 'select',
            name: 'country',
            label: 'Country',
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
            required: true,
          },
          {
            fieldType: 'text',
            name: 'emergency_contact_relation',
            label: 'Emergency Contact Relation',
            required: true,
          },
          {
            fieldType: 'email',
            name: 'emergency_contact_email',
            label: 'Emergency Contact Email',
            required: true,
          },
          {
            fieldType: 'tel',
            name: 'emergency_contact_phone',
            label: 'Emergency Contact Phone',
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
          },
          {
            fieldType: 'text',
            name: 'assistant_title',
            label: 'Title',
          },
          {
            fieldType: 'email',
            name: 'assistant_email',
            label: 'Email',
          },
          {
            fieldType: 'tel',
            name: 'assistant_phone',
            label: 'Phone',
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
          },
          {
            fieldType: 'text',
            name: 'guest_relation',
            label: 'Relation to you',
          },
          {
            fieldType: 'email',
            name: 'guest_email',
            label: 'Guest email',
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
        groupTitle: 'Your event details',
        fields: [
          {
            fieldType: 'textarea',
            name: 'dietary_restrictions',
            label: 'Dietary Restrictions or Allergies',
          },
          {
            fieldType: 'select',
            name: 'jacket_size',
            label: 'What is your jacket size?',
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
        groupDescription: 'What activities are you interested in joining?',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'activities',
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
        groupTitle: "Your Guest's event details",
        fields: [
          {
            fieldType: 'textarea',
            name: 'guest_dietary_restrictions',
            label: 'Dietary Restrictions or Allergies',
          },
          {
            fieldType: 'select',
            name: 'guest_jacket_size',
            label: "What is your guest's jacket size?",
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
        groupTitle: 'Guest Dinner Attendance',
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
        groupTitle: 'Guest Activities',
        groupDescription: 'What activities are you interested in joining?',
        fields: [
          {
            fieldType: 'checkboxGroup',
            name: 'guest_activities',
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
    ],
  },
}
