import {pgTable, text, timestamp, uuid, jsonb, pgEnum} from 'drizzle-orm/pg-core'

// Enum for jacket sizes
export const jacketSizeEnum = pgEnum('jacket_size_enum', ['XS', 'S', 'M', 'L', 'XL', 'XXL'])

export const registrations = pgTable('registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Step 1: Personal Details (required fields based on formConfig)
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  title: text('title'),
  organization: text('organization'),
  mobilePhone: text('mobile_phone').notNull(),

  // Work Address (required fields based on formConfig)
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip').notNull(),
  country: text('country').notNull(),

  // Step 2: Emergency & Contact Information (required fields)
  emergencyContactName: text('emergency_contact_name').notNull(),
  emergencyContactRelation: text('emergency_contact_relation'), // Not required per formConfig
  emergencyContactEmail: text('emergency_contact_email').notNull(),
  emergencyContactPhone: text('emergency_contact_phone').notNull(),

  // Executive Assistant (all optional)
  assistantName: text('assistant_name'),
  assistantTitle: text('assistant_title'),
  assistantEmail: text('assistant_email'),
  assistantPhone: text('assistant_phone'),

  // Guest Information (all optional)
  guestName: text('guest_name'),
  guestRelation: text('guest_relation'),
  guestEmail: text('guest_email'),

  // Step 3: Event Details (all optional)
  dietaryRestrictions: text('dietary_restrictions'),
  jacketSize: jacketSizeEnum('jacket_size'),
  accommodations: jsonb('accommodations').$type<string[]>(),
  dinnerAttendance: jsonb('dinner_attendance').$type<string[]>(),
  activities: jsonb('activities').$type<string[]>(),

  // Guest Event Details (all optional)
  guestDietaryRestrictions: text('guest_dietary_restrictions'),
  guestJacketSize: jacketSizeEnum('guest_jacket_size'),
  guestAccommodations: jsonb('guest_accommodations').$type<string[]>(),
  guestDinnerAttendance: jsonb('guest_dinner_attendance').$type<string[]>(),
  guestActivities: jsonb('guest_activities').$type<string[]>(),
})

export type Registration = typeof registrations.$inferSelect
export type NewRegistration = typeof registrations.$inferInsert
