import {pgTable, text, timestamp, uuid, jsonb, pgEnum} from 'drizzle-orm/pg-core'

// Enum for jacket sizes
export const jacketSizeEnum = pgEnum('jacket_size_enum', [
  "Women's - XS",
  "Women's - Small",
  "Women's - Medium",
  "Women's - Large",
  "Women's - XL",
  "Women's - XXL",
  "Men's - XS",
  "Men's - Small",
  "Men's - Medium",
  "Men's - Large",
  "Men's - XL",
  "Men's - XXL",
])

export const registrations = pgTable('registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  editToken: text('edit_token').notNull().unique(),

  // Step 1: Personal Details (required fields based on formConfig)
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  profilePicture: text('profile_picture'),
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

  // Admin Only
  adminNotes: text('admin_notes'),
})

export type Registration = typeof registrations.$inferSelect
export type NewRegistration = typeof registrations.$inferInsert

// Email Templates table
export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  name: text('name').notNull(),
  heading: text('heading'),
  headerImageUrl: text('header_image_url'),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
})

export type EmailTemplate = typeof emailTemplates.$inferSelect
export type NewEmailTemplate = typeof emailTemplates.$inferInsert

// Email Unsubscribes table
export const emailUnsubscribes = pgTable('email_unsubscribes', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  email: text('email').notNull().unique(),
  registrationId: uuid('registration_id').references(() => registrations.id),
})

export type EmailUnsubscribe = typeof emailUnsubscribes.$inferSelect
export type NewEmailUnsubscribe = typeof emailUnsubscribes.$inferInsert

// Chat Passwords table
export const chatPasswords = pgTable('chat_passwords', {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationId: uuid('registration_id')
    .references(() => registrations.id)
    .notNull()
    .unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type ChatPassword = typeof chatPasswords.$inferSelect

// Chat Sessions table
export const chatSessions = pgTable('chat_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationId: uuid('registration_id')
    .references(() => registrations.id)
    .notNull(),
  token: text('token').notNull().unique(),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

export type ChatSession = typeof chatSessions.$inferSelect

// Chat Messages table
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id')
    .references(() => registrations.id)
    .notNull(),
  receiverId: uuid('receiver_id')
    .references(() => registrations.id)
    .notNull(),
  content: text('content').notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type ChatMessage = typeof chatMessages.$inferSelect
