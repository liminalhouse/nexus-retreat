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
    'Thank you for registering! We look forward to seeing you at the retreat. If you need any help, email us at info@nexus-retreat.com.',

  // Step Titles
  step1Title: 'Personal Details',
  step2Title: 'Emergency & Contact Information',
  step3Title: 'Event Details',

  // Step 1: Personal Details
  email: {
    label: 'Email Address',
    placeholder: 'Your email address',
    helperText: 'This should be the email you receive your invitation from.',
    hidden: false,
  },
  firstName: {
    label: 'First name',
    placeholder: 'First name',
    hidden: false,
  },
  lastName: {
    label: 'Last name',
    placeholder: 'Last name',
    hidden: false,
  },
  profilePicture: {
    label: 'Profile Picture',
    helperText: 'Upload a profile picture (optional)',
    hidden: false,
  },
  jobTitle: {
    label: 'Title',
    placeholder: 'Your title or position',
    hidden: false,
  },
  organization: {
    label: 'Organization',
    placeholder: 'Your company or organization name',
    hidden: false,
  },
  mobilePhone: {
    label: 'Mobile Phone',
    placeholder: 'Your phone number',
    hidden: false,
  },
  address: {
    sectionTitle: 'Work Address',
    hidden: false,
    line1: {
      label: 'Address Line 1',
      placeholder: 'Address line 1',
      hidden: false,
    },
    line2: {
      label: 'Address Line 2',
      placeholder: 'Address line 2',
      hidden: false,
    },
    city: {
      label: 'City',
      placeholder: 'City',
      hidden: false,
    },
    state: {
      label: 'State / Province / County',
      placeholder: 'Your region (i.e. California, Ontario, etc.)',
      hidden: false,
    },
    zip: {
      label: 'Zip / Postal Code',
      placeholder: 'Zip or postal code',
      hidden: false,
    },
    country: {
      label: 'Country',
      placeholder: 'Select a country...',
      hidden: false,
    },
  },

  // Step 2: Emergency Contact
  emergencyContact: {
    sectionTitle: 'Emergency Contact',
    sectionDescription:
      'Please provide a contact in case of emergency while you are with us at the Retreat.',
    hidden: false,
    name: {
      label: 'Emergency Contact Name',
      placeholder: "Your emergency contact's full name",
      hidden: false,
    },
    relation: {
      label: 'Emergency Contact Relation',
      placeholder: 'Your relation to the emergency contact (optional)',
      hidden: false,
    },
    email: {
      label: 'Emergency Contact Email',
      placeholder: "Your emergency contact's email",
      hidden: false,
    },
    phone: {
      label: 'Emergency Contact Phone',
      placeholder: "Your emergency contact's phone number",
      hidden: false,
    },
  },

  // Step 2: Assistant
  assistant: {
    sectionTitle: 'Executive Assistant Point of Contact',
    sectionDescription:
      'All emails and communication regarding this event will also be sent to this email.',
    hidden: false,
    name: {
      label: 'Name',
      placeholder: "Your assistant's full name",
      hidden: false,
    },
    title: {
      label: 'Title',
      placeholder: "Your assistant's title",
      hidden: false,
    },
    email: {
      label: 'Email',
      placeholder: "Your assistant's email",
      hidden: false,
    },
    phone: {
      label: 'Phone',
      placeholder: "Your assistant's phone number",
      hidden: false,
    },
  },

  // Step 2: Guest
  guest: {
    sectionTitle: 'Guest Information',
    sectionDescription:
      'If you are bringing a partner or spouse, please provide their information below.',
    hidden: false,
    name: {
      label: 'Guest name',
      placeholder: 'Full name of your guest',
      hidden: false,
    },
    relation: {
      label: 'Relation to you',
      placeholder: 'e.g., spouse, partner, friend',
      hidden: false,
    },
    email: {
      label: 'Guest email',
      placeholder: "Your guest's email address",
      hidden: false,
    },
  },

  // Step 3: Attendee Details
  attendeeDetails: {
    sectionTitle: 'Your Event Details',
    hidden: false,
    dietaryRestrictions: {
      label: 'Dietary Restrictions or Allergies',
      placeholder: 'e.g., vegetarian, gluten-free, nut allergy',
      hidden: false,
    },
    jacketSize: {
      label: 'What is your jacket size?',
      placeholder: 'Select size',
      hidden: false,
    },
    accommodations: {
      label: 'Which nights will you be staying with us?',
      helperText:
        'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
      hidden: false,
    },
    dinnerAttendance: {
      label: 'Which nights will you attend dinner?',
      helperText: 'Please note both dinners have keynote speakers.',
      hidden: false,
    },
    activities: {
      label: 'What activities are you interested in joining?',
      helperText:
        'These are optional activities available during the retreat. Please select any that interest you.',
      hidden: false,
    },
  },

  // Step 3: Guest Event Details
  guestEventDetails: {
    sectionTitle: "Your Guest's Event Details",
    sectionDescription: '',
    hidden: false,
    dietaryRestrictions: {
      label: 'Dietary Restrictions or Allergies',
      placeholder: 'e.g., vegetarian, gluten-free, nut allergy',
      hidden: false,
    },
    jacketSize: {
      label: "What is your guest's jacket size?",
      placeholder: 'Select size',
      hidden: false,
    },
    accommodations: {
      label: 'Which nights will your guest be staying with us?',
      helperText:
        'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
      hidden: false,
    },
    dinnerAttendance: {
      label: 'Which nights will your guest attend dinner?',
      helperText: 'Please note both dinners have keynote speakers.',
      hidden: false,
    },
    activities: {
      label: 'What activities is your guest interested in joining?',
      helperText:
        'These are optional activities available during the retreat. Please select any that interest your guest.',
      hidden: false,
    },
  },
}
