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

  // Helper function to update field labels/placeholders/helperText
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
          return
        }
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
  updateField('title', sanityContent.jobTitle)
  updateField('organization', sanityContent.organization)
  updateField('mobile_phone', sanityContent.mobilePhone)

  // Update address fields
  if (sanityContent.address) {
    // Update section title
    if (config.step1?.fieldGroups?.[1] && sanityContent.address.sectionTitle) {
      config.step1.fieldGroups[1].groupTitle = sanityContent.address.sectionTitle
    }
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
  if (sanityContent.emergencyContact && config.step2?.fieldGroups?.[0]) {
    if (sanityContent.emergencyContact.sectionTitle) {
      config.step2.fieldGroups[0].groupTitle = sanityContent.emergencyContact.sectionTitle
    }
    if (sanityContent.emergencyContact.sectionDescription) {
      config.step2.fieldGroups[0].groupDescription =
        sanityContent.emergencyContact.sectionDescription
    }
    updateField('emergency_contact_name', sanityContent.emergencyContact.name)
    updateField('emergency_contact_relation', sanityContent.emergencyContact.relation)
    updateField('emergency_contact_email', sanityContent.emergencyContact.email)
    updateField('emergency_contact_phone', sanityContent.emergencyContact.phone)
  }

  // Update Step 2 - Assistant
  if (sanityContent.assistant && config.step2?.fieldGroups?.[1]) {
    if (sanityContent.assistant.sectionTitle) {
      config.step2.fieldGroups[1].groupTitle = sanityContent.assistant.sectionTitle
    }
    if (sanityContent.assistant.sectionDescription) {
      config.step2.fieldGroups[1].groupDescription = sanityContent.assistant.sectionDescription
    }
    updateField('assistant_name', sanityContent.assistant.name)
    updateField('assistant_title', sanityContent.assistant.title)
    updateField('assistant_email', sanityContent.assistant.email)
    updateField('assistant_phone', sanityContent.assistant.phone)
  }

  // Update Step 2 - Guest
  if (sanityContent.guest && config.step2?.fieldGroups?.[2]) {
    if (sanityContent.guest.sectionTitle) {
      config.step2.fieldGroups[2].groupTitle = sanityContent.guest.sectionTitle
    }
    if (sanityContent.guest.sectionDescription) {
      config.step2.fieldGroups[2].groupDescription = sanityContent.guest.sectionDescription
    }
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
    if (config.step3?.fieldGroups?.[0] && sanityContent.attendeeDetails.sectionTitle) {
      config.step3.fieldGroups[0].groupTitle = sanityContent.attendeeDetails.sectionTitle
    }
    updateField('dietary_restrictions', sanityContent.attendeeDetails.dietaryRestrictions)
    updateField('jacket_size', sanityContent.attendeeDetails.jacketSize)

    // Update accommodations
    const accommodationsField = config.step3?.fieldGroups
      ?.find((g) => g.groupTitle === 'Accommodations')
      ?.fields?.find((f) => f.name === 'accommodations')
    if (accommodationsField && sanityContent.attendeeDetails.accommodations) {
      if (sanityContent.attendeeDetails.accommodations.label) {
        accommodationsField.label = sanityContent.attendeeDetails.accommodations.label
      }
      if (sanityContent.attendeeDetails.accommodations.helperText) {
        accommodationsField.helperText = sanityContent.attendeeDetails.accommodations.helperText
      }
    }

    // Update dinner attendance
    const dinnerField = config.step3?.fieldGroups
      ?.find((g) => g.groupTitle === 'Dinner Attendance')
      ?.fields?.find((f) => f.name === 'dinner_attendance')
    if (dinnerField && sanityContent.attendeeDetails.dinnerAttendance) {
      if (sanityContent.attendeeDetails.dinnerAttendance.label) {
        dinnerField.label = sanityContent.attendeeDetails.dinnerAttendance.label
      }
      if (sanityContent.attendeeDetails.dinnerAttendance.helperText) {
        dinnerField.helperText = sanityContent.attendeeDetails.dinnerAttendance.helperText
      }
    }

    // Update activities
    const activitiesField = config.step3?.fieldGroups
      ?.find((g) => g.groupTitle === 'Activities')
      ?.fields?.find((f) => f.name === 'activities')
    if (activitiesField && sanityContent.attendeeDetails.activities) {
      if (sanityContent.attendeeDetails.activities.label) {
        activitiesField.label = sanityContent.attendeeDetails.activities.label
      }
      if (sanityContent.attendeeDetails.activities.helperText) {
        activitiesField.helperText = sanityContent.attendeeDetails.activities.helperText
      }
    }
  }

  // Update Step 3 - Guest Event Details
  if (sanityContent.guestEventDetails) {
    // Find the guest event details group
    const guestDetailsGroupIndex = config.step3?.fieldGroups?.findIndex(
      (g) => g.showIfFieldHasValue && g.fields?.some((f) => f.name === 'guest_dietary_restrictions'),
    )

    if (guestDetailsGroupIndex !== undefined && guestDetailsGroupIndex >= 0) {
      const guestGroup = config.step3?.fieldGroups?.[guestDetailsGroupIndex]
      if (guestGroup && sanityContent.guestEventDetails.sectionTitle) {
        guestGroup.groupTitle = sanityContent.guestEventDetails.sectionTitle
      }
    }

    updateField('guest_dietary_restrictions', sanityContent.guestEventDetails.dietaryRestrictions)
    updateField('guest_jacket_size', sanityContent.guestEventDetails.jacketSize)

    // Update guest accommodations
    const guestAccommodationsField = config.step3?.fieldGroups
      ?.find((g) => g.showIfFieldHasValue && g.groupTitle?.includes('Guest Accommodations'))
      ?.fields?.find((f) => f.name === 'guest_accommodations')
    if (guestAccommodationsField && sanityContent.guestEventDetails.accommodations) {
      if (sanityContent.guestEventDetails.accommodations.label) {
        guestAccommodationsField.label = sanityContent.guestEventDetails.accommodations.label
      }
      if (sanityContent.guestEventDetails.accommodations.helperText) {
        guestAccommodationsField.helperText =
          sanityContent.guestEventDetails.accommodations.helperText
      }
    }

    // Update guest dinner attendance
    const guestDinnerField = config.step3?.fieldGroups
      ?.find((g) => g.showIfFieldHasValue && g.groupTitle?.includes('Guest Dinner'))
      ?.fields?.find((f) => f.name === 'guest_dinner_attendance')
    if (guestDinnerField && sanityContent.guestEventDetails.dinnerAttendance) {
      if (sanityContent.guestEventDetails.dinnerAttendance.label) {
        guestDinnerField.label = sanityContent.guestEventDetails.dinnerAttendance.label
      }
      if (sanityContent.guestEventDetails.dinnerAttendance.helperText) {
        guestDinnerField.helperText = sanityContent.guestEventDetails.dinnerAttendance.helperText
      }
    }

    // Update guest activities
    const guestActivitiesField = config.step3?.fieldGroups
      ?.find((g) => g.showIfFieldHasValue && g.groupTitle?.includes('Guest Activities'))
      ?.fields?.find((f) => f.name === 'guest_activities')
    if (guestActivitiesField && sanityContent.guestEventDetails.activities) {
      if (sanityContent.guestEventDetails.activities.label) {
        guestActivitiesField.label = sanityContent.guestEventDetails.activities.label
      }
      if (sanityContent.guestEventDetails.activities.helperText) {
        guestActivitiesField.helperText = sanityContent.guestEventDetails.activities.helperText
      }
    }
  }

  return config
}
