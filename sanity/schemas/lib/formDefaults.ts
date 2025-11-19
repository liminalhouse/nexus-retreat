/**
 * Default values for the registration form
 * These are shared between the frontend form config and Sanity schema initial values
 */

export const FORM_DEFAULTS = {
  // General Settings
  title: 'Register for the Retreat',
  subtitle: 'HOSTED BY GEORGE PYNE AND JAY PENSKE',
  description: 'March 18-20, 2026',
  submitButtonText: 'REGISTER',
  nextButtonText: 'NEXT',
  backButtonText: '← BACK',
  successMessage:
    'Thank you for registering! We look forward to seeing you at the retreat. If you need any help, email us at nexus-retreat@gmail.com.',

  // Step Titles
  step1Title: 'Personal Details',
  step2Title: 'Emergency & Contact Information',
  step3Title: 'Event Details',

  // Step 1: Personal Details
  email: {
    label: 'Email Address',
    placeholder: 'Your email address',
    helperText: 'This should be the email you receive your invitation from.',
  },
  firstName: {
    label: 'First name',
    placeholder: 'First name',
  },
  lastName: {
    label: 'Last name',
    placeholder: 'Last name',
  },
  jobTitle: {
    label: 'Title',
    placeholder: 'Your title or position',
  },
  organization: {
    label: 'Organization',
    placeholder: 'Your company or organization name',
  },
  mobilePhone: {
    label: 'Mobile Phone',
    placeholder: 'Your phone number',
  },
  address: {
    sectionTitle: 'Work Address',
    line1: {
      label: 'Address Line 1',
      placeholder: 'Address line 1',
    },
    line2: {
      label: 'Address Line 2',
      placeholder: 'Address line 2',
    },
    city: {
      label: 'City',
      placeholder: 'City',
    },
    state: {
      label: 'State / Province / County',
      placeholder: 'Your region (i.e. California, Ontario, etc.)',
    },
    zip: {
      label: 'Zip / Postal Code',
      placeholder: 'Zip or postal code',
    },
    country: {
      label: 'Country',
      placeholder: 'Select a country...',
    },
  },

  // Step 2: Emergency Contact
  emergencyContact: {
    sectionTitle: 'Emergency Contact',
    sectionDescription:
      'Please provide a contact in case of emergency while you are with us at the Retreat.',
    name: {
      label: 'Emergency Contact Name',
      placeholder: "Your emergency contact's full name",
    },
    relation: {
      label: 'Emergency Contact Relation',
      placeholder: 'Your relation to the emergency contact (optional)',
    },
    email: {
      label: 'Emergency Contact Email',
      placeholder: "Your emergency contact's email",
    },
    phone: {
      label: 'Emergency Contact Phone',
      placeholder: "Your emergency contact's phone number",
    },
  },

  // Step 2: Assistant
  assistant: {
    sectionTitle: 'Executive Assistant Point of Contact',
    sectionDescription:
      'All emails and communication regarding this event will also be sent to this email.',
    name: {
      label: 'Name',
      placeholder: "Your assistant's full name",
    },
    title: {
      label: 'Title',
      placeholder: "Your assistant's title",
    },
    email: {
      label: 'Email',
      placeholder: "Your assistant's email",
    },
    phone: {
      label: 'Phone',
      placeholder: "Your assistant's phone number",
    },
  },

  // Step 2: Guest
  guest: {
    sectionTitle: 'Guest Information',
    sectionDescription:
      'If you are bringing a partner or spouse, please provide their information below.',
    name: {
      label: 'Guest name',
      placeholder: 'Full name of your guest',
    },
    relation: {
      label: 'Relation to you',
      placeholder: 'e.g., spouse, partner, friend',
    },
    email: {
      label: 'Guest email',
      placeholder: "Your guest's email address",
    },
  },

  // Step 3: Attendee Details
  attendeeDetails: {
    sectionTitle: 'Your Event Details',
    dietaryRestrictions: {
      label: 'Dietary Restrictions or Allergies',
      placeholder: 'e.g., vegetarian, gluten-free, nut allergy',
    },
    jacketSize: {
      label: 'What is your jacket size?',
      placeholder: 'Select size',
    },
    accommodations: {
      label: 'Which nights will you be staying with us?',
      helperText:
        'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
    },
    dinnerAttendance: {
      label: 'Which nights will you attend dinner?',
      helperText: 'Please note both dinners have keynote speakers.',
    },
    activities: {
      label: 'What activities are you interested in joining?',
      helperText:
        'These are optional activities available during the retreat. Please select any that interest you.',
    },
  },

  // Step 3: Guest Event Details
  guestEventDetails: {
    sectionTitle: "Your Guest's Event Details",
    sectionDescription: '',
    dietaryRestrictions: {
      label: 'Dietary Restrictions or Allergies',
      placeholder: 'e.g., vegetarian, gluten-free, nut allergy',
    },
    jacketSize: {
      label: "What is your guest's jacket size?",
      placeholder: 'Select size',
    },
    accommodations: {
      label: 'Which nights will your guest be staying with us?',
      helperText:
        'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
    },
    dinnerAttendance: {
      label: 'Which nights will your guest attend dinner?',
      helperText: 'Please note both dinners have keynote speakers.',
    },
    activities: {
      label: 'What activities is your guest interested in joining?',
      helperText:
        'These are optional activities available during the retreat. Please select any that interest your guest.',
    },
  },
}
