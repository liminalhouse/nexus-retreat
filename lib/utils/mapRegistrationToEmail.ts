/**
 * Maps database registration fields (camelCase) to email data format (snake_case)
 */

type DbRegistration = {
  editToken: string
  firstName: string
  lastName: string
  email: string
  mobilePhone?: string | null
  title?: string | null
  organization?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  emergencyContactName?: string | null
  emergencyContactRelation?: string | null
  emergencyContactPhone?: string | null
  emergencyContactEmail?: string | null
  assistantName?: string | null
  assistantTitle?: string | null
  assistantEmail?: string | null
  assistantPhone?: string | null
  guestName?: string | null
  guestRelation?: string | null
  guestEmail?: string | null
  dietaryRestrictions?: string | null
  jacketSize?: string | null
  accommodations?: string[] | null
  dinnerAttendance?: string[] | null
  activities?: string[] | null
  guestDietaryRestrictions?: string | null
  guestJacketSize?: string | null
  guestAccommodations?: string[] | null
  guestDinnerAttendance?: string[] | null
  guestActivities?: string[] | null
}

export type EmailRegistrationData = {
  editToken?: string
  first_name: string
  last_name: string
  email: string
  mobile_phone?: string
  title?: string
  organization?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_relation?: string
  emergency_contact_phone?: string
  emergency_contact_email?: string
  assistant_name?: string
  assistant_title?: string
  assistant_email?: string
  assistant_phone?: string
  guest_name?: string
  guest_relation?: string
  guest_email?: string
  dietary_restrictions?: string
  jacket_size?: string
  accommodations?: string[]
  dinner_attendance?: string[]
  activities?: string[]
  guest_dietary_restrictions?: string
  guest_jacket_size?: string
  guest_accommodations?: string[]
  guest_dinner_attendance?: string[]
  guest_activities?: string[]
}

export function mapRegistrationToEmailData(registration: DbRegistration): EmailRegistrationData {
  return {
    editToken: registration.editToken,
    first_name: registration.firstName,
    last_name: registration.lastName,
    email: registration.email,
    mobile_phone: registration.mobilePhone || undefined,
    title: registration.title || undefined,
    organization: registration.organization || undefined,
    address_line_1: registration.addressLine1 || undefined,
    address_line_2: registration.addressLine2 || undefined,
    city: registration.city || undefined,
    state: registration.state || undefined,
    zip: registration.zip || undefined,
    country: registration.country || undefined,
    emergency_contact_name: registration.emergencyContactName || undefined,
    emergency_contact_relation: registration.emergencyContactRelation || undefined,
    emergency_contact_phone: registration.emergencyContactPhone || undefined,
    emergency_contact_email: registration.emergencyContactEmail || undefined,
    assistant_name: registration.assistantName || undefined,
    assistant_title: registration.assistantTitle || undefined,
    assistant_email: registration.assistantEmail || undefined,
    assistant_phone: registration.assistantPhone || undefined,
    guest_name: registration.guestName || undefined,
    guest_relation: registration.guestRelation || undefined,
    guest_email: registration.guestEmail || undefined,
    dietary_restrictions: registration.dietaryRestrictions || undefined,
    jacket_size: registration.jacketSize || undefined,
    accommodations: registration.accommodations || undefined,
    dinner_attendance: registration.dinnerAttendance || undefined,
    activities: registration.activities || undefined,
    guest_dietary_restrictions: registration.guestDietaryRestrictions || undefined,
    guest_jacket_size: registration.guestJacketSize || undefined,
    guest_accommodations: registration.guestAccommodations || undefined,
    guest_dinner_attendance: registration.guestDinnerAttendance || undefined,
    guest_activities: registration.guestActivities || undefined,
  }
}
