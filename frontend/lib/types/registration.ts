// Centralized Registration type definition
// This is the single source of truth for registration data structure
export type Registration = {
  id: string
  created_at: string
  email: string
  first_name?: string
  last_name?: string
  title?: string | null
  organization?: string | null
  mobile_phone?: string
  address_line_1?: string
  address_line_2?: string | null
  city?: string
  state?: string
  zip?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_relation?: string | null
  emergency_contact_email?: string
  emergency_contact_phone?: string
  assistant_name?: string | null
  assistant_title?: string | null
  assistant_email?: string | null
  assistant_phone?: string | null
  guest_name?: string | null
  guest_relation?: string | null
  guest_email?: string | null
  dietary_restrictions?: string | null
  jacket_size?: string | null
  accommodations?: string[] | null
  dinner_attendance?: string[] | null
  activities?: string[] | null
  guest_dietary_restrictions?: string | null
  guest_jacket_size?: string | null
  guest_accommodations?: string[] | null
  guest_dinner_attendance?: string[] | null
  guest_activities?: string[] | null
}
