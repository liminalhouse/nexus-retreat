import type {FormConfig} from '@/app/components/Form/types'
import {registrationFormConfig} from './formConfig'

/**
 * Builds the complete form configuration by merging:
 * 1. Static config (field structure, names, options) from formConfig.ts
 * 2. Dynamic content (labels, placeholders, helper text) from Sanity CMS
 */
export function buildFormConfig(sanityContent: any): FormConfig {
  if (!sanityContent) {
    // If no Sanity content, return config with default values
    return {
      ...registrationFormConfig,
      title: 'Register for the Retreat',
      subtitle: 'HOSTED BY GEORGE PYNE AND JAY PENSKE',
      description: 'March 18-20, 2026',
      submitButtonText: 'REGISTER',
      nextButtonText: 'NEXT',
      backButtonText: '← BACK',
      successMessage:
        'Thank you for registering! We look forward to seeing you at the retreat. If you need any help, email us at nexus-retreat@gmail.com.',
    }
  }

  // Merge general settings from Sanity
  const config: FormConfig = {
    ...registrationFormConfig,
    title: sanityContent.title,
    subtitle: sanityContent.subtitle,
    description: sanityContent.description,
    submitButtonText: sanityContent.submitButtonText,
    nextButtonText: sanityContent.nextButtonText,
    backButtonText: sanityContent.backButtonText,
    successMessage: sanityContent.successMessage,
  }

  // Helper function to update field labels/placeholders/helperText and hidden state
  const updateField = (fieldName: string, sanityField: any) => {
    // Find the field across all steps
    const steps = [config.step1, config.step2, config.step3]
    for (const step of steps) {
      if (!step?.fieldGroups) continue
      for (const group of step.fieldGroups) {
        if (!group?.fields) continue
        const field = group.fields.find((f) => f?.name === fieldName)
        if (field && sanityField) {
          if (sanityField.label) field.label = sanityField.label
          if (sanityField.placeholder) field.placeholder = sanityField.placeholder
          if (sanityField.helperText) field.helperText = sanityField.helperText
          if (sanityField.hidden !== undefined) field.hidden = sanityField.hidden
          return
        }
      }
    }
  }

  // Helper function to update a field group (section) and mark it as hidden if needed
  const updateFieldGroup = (
    stepKey: 'step1' | 'step2' | 'step3',
    groupIndex: number,
    sanitySection: any,
  ) => {
    const step = config[stepKey]
    if (step?.fieldGroups?.[groupIndex] && sanitySection) {
      if (sanitySection.sectionTitle) {
        step.fieldGroups[groupIndex].groupTitle = sanitySection.sectionTitle
      }
      if (sanitySection.sectionDescription) {
        step.fieldGroups[groupIndex].groupDescription = sanitySection.sectionDescription
      }
      if (sanitySection.hidden) {
        step.fieldGroups[groupIndex].hidden = true
      }
    }
  }

  // Helper function to find and update a field group by title
  const updateFieldGroupByTitle = (
    stepKey: 'step1' | 'step2' | 'step3',
    groupTitle: string,
    sanityFieldData: any,
  ) => {
    const step = config[stepKey]
    if (!step?.fieldGroups) return

    const group = step.fieldGroups.find((g) => g.groupTitle === groupTitle)
    if (group && sanityFieldData) {
      // Update the field in this group
      const field = group.fields?.[0] // Most of these groups have a single field
      if (field) {
        if (sanityFieldData.label) field.label = sanityFieldData.label
        if (sanityFieldData.helperText) field.helperText = sanityFieldData.helperText
        if (sanityFieldData.hidden) field.hidden = sanityFieldData.hidden
      }
      // Also mark the entire group as hidden if the field is hidden
      if (sanityFieldData.hidden) {
        group.hidden = true
      }
    }
  }

  // Update Step 1 titles
  if (config.step1 && sanityContent.step1Title) {
    config.step1.title = sanityContent.step1Title
  }

  // Update Step 1 fields
  updateField('email', sanityContent.email)
  updateField('first_name', sanityContent.firstName)
  updateField('last_name', sanityContent.lastName)
  updateField('profile_picture', sanityContent.profilePicture)
  updateField('title', sanityContent.jobTitle)
  updateField('organization', sanityContent.organization)
  updateField('mobile_phone', sanityContent.mobilePhone)

  // Update address fields
  if (sanityContent.address) {
    updateFieldGroup('step1', 1, sanityContent.address)
    updateField('address_line_1', sanityContent.address.line1)
    updateField('address_line_2', sanityContent.address.line2)
    updateField('city', sanityContent.address.city)
    updateField('state', sanityContent.address.state)
    updateField('zip', sanityContent.address.zip)
    updateField('country', sanityContent.address.country)
  }

  // Update Step 2 titles
  if (config.step2 && sanityContent.step2Title) {
    config.step2.title = sanityContent.step2Title
  }

  // Update Step 2 - Emergency Contact
  if (sanityContent.emergencyContact) {
    updateFieldGroup('step2', 0, sanityContent.emergencyContact)
    updateField('emergency_contact_name', sanityContent.emergencyContact.name)
    updateField('emergency_contact_relation', sanityContent.emergencyContact.relation)
    updateField('emergency_contact_email', sanityContent.emergencyContact.email)
    updateField('emergency_contact_phone', sanityContent.emergencyContact.phone)
  }

  // Update Step 2 - Assistant
  if (sanityContent.assistant) {
    updateFieldGroup('step2', 1, sanityContent.assistant)
    updateField('assistant_name', sanityContent.assistant.name)
    updateField('assistant_title', sanityContent.assistant.title)
    updateField('assistant_email', sanityContent.assistant.email)
    updateField('assistant_phone', sanityContent.assistant.phone)
  }

  // Update Step 2 - Guest
  if (sanityContent.guest) {
    updateFieldGroup('step2', 2, sanityContent.guest)
    updateField('guest_name', sanityContent.guest.name)
    updateField('guest_relation', sanityContent.guest.relation)
    updateField('guest_email', sanityContent.guest.email)
  }

  // Update Step 3 titles
  if (config.step3 && sanityContent.step3Title) {
    config.step3.title = sanityContent.step3Title
  }

  // Update Step 3 - Attendee Details
  if (sanityContent.attendeeDetails) {
    updateFieldGroup('step3', 0, sanityContent.attendeeDetails)
    updateField('dietary_restrictions', sanityContent.attendeeDetails.dietaryRestrictions)
    updateField('jacket_size', sanityContent.attendeeDetails.jacketSize)

    // Update accommodations, dinner, and activities
    updateFieldGroupByTitle('step3', 'Accommodations', sanityContent.attendeeDetails.accommodations)
    updateFieldGroupByTitle(
      'step3',
      'Dinner Attendance',
      sanityContent.attendeeDetails.dinnerAttendance,
    )
    updateFieldGroupByTitle('step3', 'Activities', sanityContent.attendeeDetails.activities)
  }

  // Update Step 3 - Guest Event Details
  if (sanityContent.guestEventDetails) {
    // Update guest details section title and hidden state
    const guestDetailsGroupIndex = config.step3?.fieldGroups?.findIndex(
      (g) => g.showIfFieldHasValue && g.fields?.some((f) => f.name === 'guest_dietary_restrictions'),
    )
    if (guestDetailsGroupIndex !== undefined && guestDetailsGroupIndex >= 0) {
      const guestGroup = config.step3?.fieldGroups?.[guestDetailsGroupIndex]
      if (guestGroup && sanityContent.guestEventDetails.sectionTitle) {
        guestGroup.groupTitle = sanityContent.guestEventDetails.sectionTitle
      }
      if (guestGroup && sanityContent.guestEventDetails.hidden) {
        guestGroup.hidden = true
      }
    }

    updateField('guest_dietary_restrictions', sanityContent.guestEventDetails.dietaryRestrictions)
    updateField('guest_jacket_size', sanityContent.guestEventDetails.jacketSize)

    // Update guest accommodations, dinner, and activities
    updateFieldGroupByTitle(
      'step3',
      'Guest Accommodations',
      sanityContent.guestEventDetails.accommodations,
    )
    updateFieldGroupByTitle(
      'step3',
      'Guest Dinner Attendance',
      sanityContent.guestEventDetails.dinnerAttendance,
    )
    updateFieldGroupByTitle('step3', 'Guest Activities', sanityContent.guestEventDetails.activities)
  }

  return config
}
