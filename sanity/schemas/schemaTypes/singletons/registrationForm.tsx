import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {FORM_DEFAULTS} from '../../lib/formDefaults'

/**
 * Registration Form Content Singleton
 * This singleton stores all editable text content for the registration form
 * including headings, descriptions, labels, placeholders, and helper text.
 * The field names are fixed to match the database schema, but all visible text is editable.
 */

export const registrationForm = defineType({
  name: 'registrationForm',
  title: 'Registration Form',
  type: 'document',
  icon: DocumentTextIcon,
  // @ts-ignore - Sanity types don't include initialValue at the document level
  initialValue: {
    _id: 'registrationFormContent',
    ...FORM_DEFAULTS,
  },
  groups: [
    {name: 'general', title: 'General Settings'},
    {name: 'step1', title: 'Step 1: Personal Details'},
    {name: 'step2', title: 'Step 2: Contacts & Guest'},
    {name: 'step3', title: 'Step 3: Event Details'},
  ],
  fields: [
    // ========== GENERAL SETTINGS ==========
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      description: 'Main heading displayed at the top of the form',
      initialValue: FORM_DEFAULTS.title,
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'subtitle',
      title: 'Form Subtitle',
      type: 'string',
      description: 'Subtitle displayed below the title',
      initialValue: FORM_DEFAULTS.subtitle,
      group: 'general',
    }),
    defineField({
      name: 'description',
      title: 'Form Description',
      type: 'string',
      description: 'Additional description text (e.g., dates)',
      initialValue: FORM_DEFAULTS.description,
      group: 'general',
    }),
    defineField({
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: FORM_DEFAULTS.submitButtonText,
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'nextButtonText',
      title: 'Next Button Text',
      type: 'string',
      initialValue: FORM_DEFAULTS.nextButtonText,
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'backButtonText',
      title: 'Back Button Text',
      type: 'string',
      initialValue: FORM_DEFAULTS.backButtonText,
      validation: (rule) => rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      description: 'Message displayed after successful registration',
      rows: 3,
      initialValue: FORM_DEFAULTS.successMessage,
      validation: (rule) => rule.required(),
      group: 'general',
    }),

    // ========== STEP 1: PERSONAL DETAILS ==========
    defineField({
      name: 'step1Title',
      title: 'Step 1 Title',
      type: 'string',
      initialValue: FORM_DEFAULTS.step1Title,
      validation: (rule) => rule.required(),
      group: 'step1',
    }),

    // Email
    defineField({
      name: 'email',
      title: 'Email',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.email.label,
        },
        {
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          initialValue: FORM_DEFAULTS.email.placeholder,
        },
        {
          name: 'helperText',
          title: 'Helper Text',
          type: 'text',
          rows: 2,
          initialValue: FORM_DEFAULTS.email.helperText,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.email.hidden,
        },
      ],
    }),

    // First Name
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.firstName.label,
        },
        {
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          initialValue: FORM_DEFAULTS.firstName.placeholder,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.firstName.hidden,
        },
      ],
    }),

    // Last Name
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.lastName.label,
        },
        {
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          initialValue: FORM_DEFAULTS.lastName.placeholder,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.lastName.hidden,
        },
      ],
    }),

    // Profile Picture
    defineField({
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.profilePicture.label,
        },
        {
          name: 'helperText',
          title: 'Helper Text',
          type: 'text',
          rows: 2,
          initialValue: FORM_DEFAULTS.profilePicture.helperText,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.profilePicture.hidden,
        },
      ],
    }),

    // Title
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.jobTitle.label,
        },
        {
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          initialValue: FORM_DEFAULTS.jobTitle.placeholder,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.jobTitle.hidden,
        },
      ],
    }),

    // Organization
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.organization.label,
        },
        {
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          initialValue: FORM_DEFAULTS.organization.placeholder,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.organization.hidden,
        },
      ],
    }),

    // Mobile Phone
    defineField({
      name: 'mobilePhone',
      title: 'Mobile Phone',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          initialValue: FORM_DEFAULTS.mobilePhone.label,
        },
        {
          name: 'placeholder',
          title: 'Placeholder',
          type: 'string',
          initialValue: FORM_DEFAULTS.mobilePhone.placeholder,
        },
        {
          name: 'hidden',
          title: 'Hide Field',
          type: 'boolean',
          description: 'Toggle to hide this field from the registration form',
          initialValue: FORM_DEFAULTS.mobilePhone.hidden,
        },
      ],
    }),

    // Address Section
    defineField({
      name: 'address',
      title: 'Work Address',
      type: 'object',
      group: 'step1',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: FORM_DEFAULTS.address.sectionTitle,
        },
        {
          name: 'line1',
          title: 'Address Line 1',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.line1.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.line1.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.address.line1.hidden,
            },
          ],
        },
        {
          name: 'line2',
          title: 'Address Line 2',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.line2.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.line2.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.address.line2.hidden,
            },
          ],
        },
        {
          name: 'city',
          title: 'City',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.city.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.city.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.address.city.hidden,
            },
          ],
        },
        {
          name: 'state',
          title: 'State',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.state.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.state.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.address.state.hidden,
            },
          ],
        },
        {
          name: 'zip',
          title: 'Zip',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.zip.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.zip.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.address.zip.hidden,
            },
          ],
        },
        {
          name: 'country',
          title: 'Country',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.country.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.address.country.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.address.country.hidden,
            },
          ],
        },
      ],
    }),

    // ========== STEP 2: CONTACTS & GUEST ==========
    defineField({
      name: 'step2Title',
      title: 'Step 2 Title',
      type: 'string',
      initialValue: FORM_DEFAULTS.step2Title,
      validation: (rule) => rule.required(),
      group: 'step2',
    }),

    // Emergency Contact Section
    defineField({
      name: 'emergencyContact',
      title: 'Emergency Contact',
      type: 'object',
      group: 'step2',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: FORM_DEFAULTS.emergencyContact.sectionTitle,
        },
        {
          name: 'sectionDescription',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          initialValue: FORM_DEFAULTS.emergencyContact.sectionDescription,
        },
        {
          name: 'name',
          title: 'Full Name',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.name.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.name.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.emergencyContact.name.hidden,
            },
          ],
        },
        {
          name: 'relation',
          title: 'Relation',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.relation.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.relation.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.emergencyContact.relation.hidden,
            },
          ],
        },
        {
          name: 'email',
          title: 'Email',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.email.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.email.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.emergencyContact.email.hidden,
            },
          ],
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.phone.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.emergencyContact.phone.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.emergencyContact.phone.hidden,
            },
          ],
        },
      ],
    }),

    // Assistant Section
    defineField({
      name: 'assistant',
      title: 'Executive Assistant',
      type: 'object',
      group: 'step2',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: FORM_DEFAULTS.assistant.sectionTitle,
        },
        {
          name: 'sectionDescription',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          initialValue: FORM_DEFAULTS.assistant.sectionDescription,
        },
        {
          name: 'name',
          title: 'Full Name',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.name.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.name.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.assistant.name.hidden,
            },
          ],
        },
        {
          name: 'title',
          title: 'Title',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.title.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.title.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.assistant.title.hidden,
            },
          ],
        },
        {
          name: 'email',
          title: 'Email',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.email.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.email.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.assistant.email.hidden,
            },
          ],
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.phone.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.assistant.phone.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.assistant.phone.hidden,
            },
          ],
        },
      ],
    }),

    // Guest Section
    defineField({
      name: 'guest',
      title: 'Guest Information',
      type: 'object',
      group: 'step2',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: FORM_DEFAULTS.guest.sectionTitle,
        },
        {
          name: 'sectionDescription',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          initialValue: FORM_DEFAULTS.guest.sectionDescription,
        },
        {
          name: 'name',
          title: 'Full Name',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guest.name.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.guest.name.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guest.name.hidden,
            },
          ],
        },
        {
          name: 'relation',
          title: 'Relation',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guest.relation.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.guest.relation.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guest.relation.hidden,
            },
          ],
        },
        {
          name: 'email',
          title: 'Email',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guest.email.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.guest.email.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guest.email.hidden,
            },
          ],
        },
      ],
    }),

    // ========== STEP 3: EVENT DETAILS ==========
    defineField({
      name: 'step3Title',
      title: 'Step 3 Title',
      type: 'string',
      initialValue: FORM_DEFAULTS.step3Title,
      validation: (rule) => rule.required(),
      group: 'step3',
    }),

    // Attendee Details Section
    defineField({
      name: 'attendeeDetails',
      title: 'Attendee Details',
      type: 'object',
      group: 'step3',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: FORM_DEFAULTS.attendeeDetails.sectionTitle,
        },
        {
          name: 'dietaryRestrictions',
          title: 'Dietary Restrictions',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.dietaryRestrictions.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.dietaryRestrictions.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.attendeeDetails.dietaryRestrictions.hidden,
            },
          ],
        },
        {
          name: 'jacketSize',
          title: 'Jacket Size',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.jacketSize.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.jacketSize.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.attendeeDetails.jacketSize.hidden,
            },
          ],
        },
        {
          name: 'accommodations',
          title: 'Accommodations',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.accommodations.label,
            },
            {
              name: 'helperText',
              title: 'Helper Text',
              type: 'text',
              rows: 2,
              initialValue: FORM_DEFAULTS.attendeeDetails.accommodations.helperText,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.attendeeDetails.accommodations.hidden,
            },
          ],
        },
        {
          name: 'dinnerAttendance',
          title: 'Dinner Attendance',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.dinnerAttendance.label,
            },
            {
              name: 'helperText',
              title: 'Helper Text',
              type: 'text',
              rows: 2,
              initialValue: FORM_DEFAULTS.attendeeDetails.dinnerAttendance.helperText,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.attendeeDetails.dinnerAttendance.hidden,
            },
          ],
        },
        {
          name: 'activities',
          title: 'Activities',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.attendeeDetails.activities.label,
            },
            {
              name: 'helperText',
              title: 'Helper Text',
              type: 'text',
              rows: 2,
              initialValue: FORM_DEFAULTS.attendeeDetails.activities.helperText,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.attendeeDetails.activities.hidden,
            },
          ],
        },
      ],
    }),

    // Guest Event Details Section
    defineField({
      name: 'guestEventDetails',
      title: 'Guest Event Details',
      type: 'object',
      group: 'step3',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: FORM_DEFAULTS.guestEventDetails.sectionTitle,
        },
        {
          name: 'sectionDescription',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          initialValue: FORM_DEFAULTS.guestEventDetails.sectionDescription,
        },
        {
          name: 'dietaryRestrictions',
          title: 'Dietary Restrictions',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.dietaryRestrictions.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.dietaryRestrictions.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guestEventDetails.dietaryRestrictions.hidden,
            },
          ],
        },
        {
          name: 'jacketSize',
          title: 'Jacket Size',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.jacketSize.label,
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.jacketSize.placeholder,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guestEventDetails.jacketSize.hidden,
            },
          ],
        },
        {
          name: 'accommodations',
          title: 'Accommodations',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.accommodations.label,
            },
            {
              name: 'helperText',
              title: 'Helper Text',
              type: 'text',
              rows: 2,
              initialValue: FORM_DEFAULTS.guestEventDetails.accommodations.helperText,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guestEventDetails.accommodations.hidden,
            },
          ],
        },
        {
          name: 'dinnerAttendance',
          title: 'Dinner Attendance',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.dinnerAttendance.label,
            },
            {
              name: 'helperText',
              title: 'Helper Text',
              type: 'text',
              rows: 2,
              initialValue: FORM_DEFAULTS.guestEventDetails.dinnerAttendance.helperText,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guestEventDetails.dinnerAttendance.hidden,
            },
          ],
        },
        {
          name: 'activities',
          title: 'Activities',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: FORM_DEFAULTS.guestEventDetails.activities.label,
            },
            {
              name: 'helperText',
              title: 'Helper Text',
              type: 'text',
              rows: 2,
              initialValue: FORM_DEFAULTS.guestEventDetails.activities.helperText,
            },
            {
              name: 'hidden',
              title: 'Hide Field',
              type: 'boolean',
              description: 'Toggle to hide this field from the registration form',
              initialValue: FORM_DEFAULTS.guestEventDetails.activities.hidden,
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Registration Form Content',
        subtitle: 'Editable form text and labels',
      }
    },
  },
})
