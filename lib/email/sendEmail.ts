import {Resend} from 'resend'
import {client} from '@/sanity/lib/client'
import {toPlainText} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {getEditRegistrationUrl, getEditActivitiesUrl} from '@/lib/utils/editUrls'
import {ACTIVITY_OPTIONS} from '@/lib/utils/formatRegistrationFields'

const resend = new Resend(process.env.RESEND_API_KEY)
const resendEmailFrom = process.env.RESEND_FROM_EMAIL || 'noreply@noreply.nexus-retreat.com'
const defaultCcEmail = process.env.RESEND_CC_EMAIL || 'info@nexus-retreat.com'

// ============================================================================
// Types
// ============================================================================

type EmailTemplate = {
  subject: string
  greeting: string
  headerImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  bodyIntro: PortableTextBlock[]
  bodyOutro: PortableTextBlock[]
  signature: string
}

export type RegistrationData = {
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

interface EmailPayload {
  from: string
  to: string
  subject: string
  html: string
  cc?: string[]
}

interface EmailSection {
  type: 'greeting' | 'text' | 'button' | 'registrationDetails' | 'editLink' | 'custom'
  content?: string
  buttonText?: string
  buttonUrl?: string
  title?: string
}

interface BuildEmailOptions {
  headerImageUrl?: string
  headerImageAlt?: string
  sections: EmailSection[]
  signature?: string
}

// ============================================================================
// Activity Formatting
// ============================================================================

const ACTIVITY_OPTIONS_MAP = new Map(ACTIVITY_OPTIONS.map((opt) => [opt.value, opt]))

function formatActivityForEmail(value: string): string {
  const option = ACTIVITY_OPTIONS_MAP.get(value)
  if (!option) {
    return value.replace(/_/g, ' ')
  }

  if (option.description) {
    return `<strong>${option.label}</strong><br/><span style="color: #6b7280; font-size: 13px;">${option.description}</span>`
  }
  return `<strong>${option.label}</strong>`
}

// ============================================================================
// Shared Email Builder
// ============================================================================

function buildEmailHtml(options: BuildEmailOptions): string {
  const {headerImageUrl, headerImageAlt, sections, signature} = options

  const headerImageHtml = headerImageUrl
    ? `<div style="margin-bottom: 24px; text-align: center;">
         <img src="${headerImageUrl}" alt="${headerImageAlt || 'Email header'}" style="max-width: 100%; height: auto; border-radius: 8px;" />
       </div>`
    : ''

  const sectionsHtml = sections
    .map((section) => {
      switch (section.type) {
        case 'greeting':
          return `<p style="font-size: 16px; margin-bottom: 16px; white-space: pre-line;">${section.content}</p>`

        case 'text':
          return section.content
            ? `<p style="font-size: 14px; color: #374151; margin-bottom: 24px; white-space: pre-line;">${section.content}</p>`
            : ''

        case 'button':
          return `<div style="margin: 32px 0; text-align: center;">
             <a href="${section.buttonUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0369a1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
               ${section.buttonText}
             </a>
           </div>`

        case 'registrationDetails':
          return `<div style="border-top: 2px solid #e5e7eb; padding-top: 24px;">
             <h2 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px;">${section.title || 'Your Registration Details'}</h2>
             ${section.content}
           </div>`

        case 'editLink':
          return section.buttonUrl
            ? `<div style="margin: 32px 0; padding: 24px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0369a1;">
               <h3 style="font-size: 16px; font-weight: 600; color: #0369a1; margin: 0 0 12px 0;">Need to Make Changes?</h3>
               <p style="font-size: 14px; color: #374151; margin: 0 0 16px 0;">
                 If you need to update your registration information, you can use the link below:
               </p>
               <a href="${section.buttonUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0369a1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                 Edit My Registration
               </a>
               <p style="font-size: 12px; color: #6b7280; margin: 16px 0 0 0;">
                 This link is unique to your registration and can be used at any time.
               </p>
             </div>`
            : ''

        case 'custom':
          return section.content || ''

        default:
          return ''
      }
    })
    .join('\n')

  const signatureHtml = signature
    ? `<p style="font-size: 14px; color: #374151; margin-top: 24px; white-space: pre-line;">${signature}</p>`
    : ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px;">
          ${headerImageHtml}
          ${sectionsHtml}
          ${signatureHtml}
        </div>
      </body>
    </html>
  `
}

// ============================================================================
// Helper Functions
// ============================================================================

async function getEmailTemplate(type: string): Promise<EmailTemplate | null> {
  const query = `*[_type == "emailTemplate" && type == $type && isActive == true][0] {
    subject,
    greeting,
    headerImage {
      asset->{
        _id,
        url
      },
      alt
    },
    bodyIntro,
    bodyOutro,
    signature
  }`

  const template = await client.fetch(query, {type})
  return template
}

function replaceVariables(text: string, data: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match
  })
}

function formatRegistrationDetails(data: RegistrationData): string {
  const sections: string[] = []

  // Personal Information
  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Personal Information</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">First Name:</span> <strong>${data.first_name || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Last Name:</span> <strong>${data.last_name || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Email:</span> <strong>${data.email || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Phone:</span> <strong>${data.mobile_phone || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Title:</span> <strong>${data.title || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Organization:</span> <strong>${data.organization || '-'}</strong></p>
    </div>
  `)

  // Address
  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Address</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Street:</span> <strong>${data.address_line_1 ? `${data.address_line_1}${data.address_line_2 ? `, ${data.address_line_2}` : ''}` : '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">City:</span> <strong>${data.city || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">State:</span> <strong>${data.state || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Zip Code:</span> <strong>${data.zip || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Country:</span> <strong>${data.country || '-'}</strong></p>
    </div>
  `)

  // Emergency Contact
  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Emergency Contact</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Name:</span> <strong>${data.emergency_contact_name || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Relation:</span> <strong>${data.emergency_contact_relation || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Phone:</span> <strong>${data.emergency_contact_phone || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Email:</span> <strong>${data.emergency_contact_email || '-'}</strong></p>
    </div>
  `)

  // Executive Assistant
  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Executive Assistant</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Name:</span> <strong>${data.assistant_name || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Title:</span> <strong>${data.assistant_title || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Email:</span> <strong>${data.assistant_email || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Phone:</span> <strong>${data.assistant_phone || '-'}</strong></p>
    </div>
  `)

  // Guest Information
  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Guest Information</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Name:</span> <strong>${data.guest_name || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Relation:</span> <strong>${data.guest_relation || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Email:</span> <strong>${data.guest_email || '-'}</strong></p>
    </div>
  `)

  // Event Details
  const accommodationsHtml =
    data.accommodations && data.accommodations.length > 0
      ? `<ul style="margin: 4px 0; padding-left: 20px;">${data.accommodations.map((acc) => `<li>${acc.replace('_', ' ')}</li>`).join('')}</ul>`
      : '<strong>-</strong>'

  const dinnersHtml =
    data.dinner_attendance && data.dinner_attendance.length > 0
      ? `<ul style="margin: 4px 0; padding-left: 20px;">${data.dinner_attendance.map((d) => `<li>${d.replace('_', ' ')}</li>`).join('')}</ul>`
      : '<strong>-</strong>'

  const activitiesHtml =
    data.activities && data.activities.length > 0
      ? `<ul style="margin: 4px 0; padding-left: 20px; list-style: none;">${data.activities.map((a) => `<li style="margin-bottom: 8px;">${formatActivityForEmail(a)}</li>`).join('')}</ul>`
      : '<strong>-</strong>'

  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Event Details</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Dietary Restrictions:</span> <strong>${data.dietary_restrictions || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Jacket Size:</span> <strong>${data.jacket_size || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Accommodations:</span> ${accommodationsHtml}</p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Dinner Attendance:</span> ${dinnersHtml}</p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Activities:</span> ${activitiesHtml}</p>
    </div>
  `)

  // Guest Event Details
  const guestAccommodationsHtml =
    data.guest_accommodations && data.guest_accommodations.length > 0
      ? `<ul style="margin: 4px 0; padding-left: 20px;">${data.guest_accommodations.map((acc) => `<li>${acc.replace('_', ' ')}</li>`).join('')}</ul>`
      : '<strong>-</strong>'

  const guestDinnersHtml =
    data.guest_dinner_attendance && data.guest_dinner_attendance.length > 0
      ? `<ul style="margin: 4px 0; padding-left: 20px;">${data.guest_dinner_attendance.map((d) => `<li>${d.replace('_', ' ')}</li>`).join('')}</ul>`
      : '<strong>-</strong>'

  const guestActivitiesHtml =
    data.guest_activities && data.guest_activities.length > 0
      ? `<ul style="margin: 4px 0; padding-left: 20px; list-style: none;">${data.guest_activities.map((a) => `<li style="margin-bottom: 8px;">${formatActivityForEmail(a)}</li>`).join('')}</ul>`
      : '<strong>-</strong>'

  sections.push(`
    <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 24px; margin-bottom: 12px;">Guest Event Details</h3>
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Dietary Restrictions:</span> <strong>${data.guest_dietary_restrictions || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Jacket Size:</span> <strong>${data.guest_jacket_size || '-'}</strong></p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Accommodations:</span> ${guestAccommodationsHtml}</p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Dinner Attendance:</span> ${guestDinnersHtml}</p>
      <p style="margin: 8px 0;"><span style="color: #6b7280;">Guest Activities:</span> ${guestActivitiesHtml}</p>
    </div>
  `)

  return sections.join('')
}

function buildCcList(
  data: {email: string; assistant_email?: string; guest_email?: string},
  includeDefault = false,
): string[] {
  const cc: string[] = []
  if (includeDefault) {
    cc.push(defaultCcEmail)
  }
  if (data.assistant_email && data.assistant_email !== data.email) {
    cc.push(data.assistant_email)
  }
  if (
    data.guest_email &&
    data.guest_email !== data.email &&
    data.guest_email !== defaultCcEmail
  ) {
    cc.push(data.guest_email)
  }
  return cc
}

async function sendEmail(
  payload: EmailPayload,
  options?: {idempotencyKey?: string},
): Promise<{success: boolean; data?: unknown; error?: unknown}> {
  try {
    const headers: Record<string, string> = {}
    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey
    }

    console.log('Sending email via Resend...', {
      from: payload.from,
      to: payload.to,
      cc: payload.cc,
      subject: payload.subject,
      idempotencyKey: options?.idempotencyKey,
    })

    const response = await resend.emails.send(payload, {headers})
    return {success: true, data: response}
  } catch (error) {
    console.error('Error sending email:', error)
    return {success: false, error}
  }
}

// ============================================================================
// Email Sending Functions
// ============================================================================

export async function sendActivitySelectionEmail(data: RegistrationData) {
  try {
    const template = await getEmailTemplate('activity_selection')

    if (!template) {
      throw new Error(
        'Activity selection email template not found. Please create an active template with type "activity_selection".',
      )
    }

    const variables = {
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`,
    }

    const subject = replaceVariables(template.subject, variables)
    const greeting = replaceVariables(template.greeting, variables)
    const bodyIntroText = template.bodyIntro ? toPlainText(template.bodyIntro) : ''
    const bodyOutroText = template.bodyOutro ? toPlainText(template.bodyOutro) : ''

    const html = buildEmailHtml({
      headerImageUrl: template.headerImage?.asset?.url,
      headerImageAlt: template.headerImage?.alt,
      sections: [
        {type: 'greeting', content: greeting},
        {type: 'text', content: bodyIntroText},
        {
          type: 'button',
          buttonText: 'Select Your Activities',
          buttonUrl: getEditActivitiesUrl(data.editToken || ''),
        },
        {type: 'text', content: bodyOutroText},
      ],
      signature: template.signature,
    })

    const cc = buildCcList(data)

    return sendEmail({
      from: `Nexus Retreat <${resendEmailFrom}>`,
      to: data.email,
      subject,
      html,
      cc: cc.length > 0 ? cc : undefined,
    })
  } catch (error) {
    console.error('Error sending activity selection email:', error)
    return {success: false, error}
  }
}

export async function sendRegistrationConfirmation(data: RegistrationData) {
  try {
    const template = await getEmailTemplate('registration_confirmation')

    if (!template) {
      throw new Error(
        'Registration confirmation email template not found. Please create an active template with type "registration_confirmation".',
      )
    }

    const variables = {
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`,
    }

    const subject = replaceVariables(template.subject, variables)
    const greeting = replaceVariables(template.greeting, variables)
    const bodyIntroText = template.bodyIntro ? toPlainText(template.bodyIntro) : ''
    const bodyOutroText = template.bodyOutro ? toPlainText(template.bodyOutro) : ''
    const registrationDetails = formatRegistrationDetails(data)
    const editLink = data.editToken ? getEditRegistrationUrl(data.editToken) : ''

    const html = buildEmailHtml({
      headerImageUrl: template.headerImage?.asset?.url,
      headerImageAlt: template.headerImage?.alt,
      sections: [
        {type: 'greeting', content: greeting},
        {type: 'text', content: bodyIntroText},
        {
          type: 'registrationDetails',
          title: 'Your Registration Details',
          content: registrationDetails,
        },
        {type: 'editLink', buttonUrl: editLink},
        {type: 'text', content: bodyOutroText},
      ],
      signature: template.signature,
    })

    const cc = buildCcList(data)

    return sendEmail(
      {
        from: `Nexus Retreat <${resendEmailFrom}>`,
        to: data.email,
        subject,
        html,
        cc: cc.length > 0 ? cc : undefined,
      },
      {idempotencyKey: data.editToken ? `registration-${data.editToken}` : undefined},
    )
  } catch (error) {
    console.error('Error sending registration confirmation email:', error)
    return {success: false, error}
  }
}

export async function sendActivityUpdateConfirmation(data: RegistrationData) {
  try {
    const template = await getEmailTemplate('activity_update_confirmation')

    if (!template) {
      throw new Error(
        'Activity update confirmation email template not found. Please create an active template with type "activity_update_confirmation".',
      )
    }

    const variables = {
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`,
    }

    const subject = replaceVariables(template.subject, variables)
    const greeting = replaceVariables(template.greeting, variables)
    const bodyIntroText = template.bodyIntro ? toPlainText(template.bodyIntro) : ''
    const bodyOutroText = template.bodyOutro ? toPlainText(template.bodyOutro) : ''
    const registrationDetails = formatRegistrationDetails(data)
    const editLink = data.editToken ? getEditRegistrationUrl(data.editToken) : ''

    const html = buildEmailHtml({
      headerImageUrl: template.headerImage?.asset?.url,
      headerImageAlt: template.headerImage?.alt,
      sections: [
        {type: 'greeting', content: greeting},
        {type: 'text', content: bodyIntroText},
        {
          type: 'registrationDetails',
          title: 'Your Updated Registration Details',
          content: registrationDetails,
        },
        {type: 'editLink', buttonUrl: editLink},
        {type: 'text', content: bodyOutroText},
      ],
      signature: template.signature,
    })

    const cc = buildCcList(data)

    return sendEmail({
      from: `Nexus Retreat <${resendEmailFrom}>`,
      to: data.email,
      subject,
      html,
      cc: cc.length > 0 ? cc : undefined,
    })
  } catch (error) {
    console.error('Error sending activity update confirmation email:', error)
    return {success: false, error}
  }
}

// ============================================================================
// Custom Email (for bulk admin emails)
// ============================================================================

type CustomEmailRegistration = {
  firstName: string
  lastName: string
  email: string
  mobilePhone?: string | null
  title?: string | null
  organization?: string | null
  city?: string | null
  state?: string | null
  guestName?: string | null
  editToken?: string | null
}

type CustomEmailParams = {
  to: string
  subject: string
  body: string
  headerImageUrl?: string
  cc?: string[]
  registration: CustomEmailRegistration
}

export async function sendCustomEmail(params: CustomEmailParams) {
  try {
    const {to, subject, body, headerImageUrl, cc, registration} = params

    const variables: Record<string, string> = {
      firstName: registration.firstName,
      lastName: registration.lastName,
      fullName: `${registration.firstName} ${registration.lastName}`,
      email: registration.email,
      mobilePhone: registration.mobilePhone || '',
      title: registration.title || '',
      organization: registration.organization || '',
      city: registration.city || '',
      state: registration.state || '',
      guestName: registration.guestName || '',
    }

    const processedSubject = replaceVariables(subject, variables)
    const processedBody = replaceVariables(body, variables)

    const html = buildEmailHtml({
      headerImageUrl,
      sections: [{type: 'custom', content: `<div style="white-space: pre-line;">${processedBody}</div>`}],
    })

    return sendEmail({
      from: `Nexus Retreat <${resendEmailFrom}>`,
      to,
      subject: processedSubject,
      html,
      cc,
    })
  } catch (error) {
    console.error('Error sending custom email:', error)
    return {success: false, error}
  }
}
