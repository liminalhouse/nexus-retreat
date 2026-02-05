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
  bcc?: string[]
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
// Nexus Brand Colors
// ============================================================================

const NEXUS_COLORS = {
  navy: '#3d4663',
  navyDark: '#1c2544',
  coral: '#f49898',
  coralLight: '#f5a8a8',
  beige: '#faf5f1',
  seafoam: '#bed1bf',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
  },
}

// ============================================================================
// Shared Email Builder
// ============================================================================

function buildEmailHtml(options: BuildEmailOptions): string {
  const {headerImageUrl, headerImageAlt, sections, signature} = options

  const headerImageHtml = headerImageUrl
    ? `<tr>
         <td style="padding: 0;">
           <img src="${headerImageUrl}" alt="${headerImageAlt || 'Nexus Retreat'}" style="width: 100%; height: auto; display: block;" />
         </td>
       </tr>`
    : ''

  const sectionsHtml = sections
    .map((section) => {
      switch (section.type) {
        case 'greeting':
          return `<p style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: ${NEXUS_COLORS.navy}; margin: 0 0 20px 0; line-height: 1.5;">${section.content}</p>`

        case 'text':
          return section.content
            ? `<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: ${NEXUS_COLORS.gray[600]}; margin: 0 0 20px 0; line-height: 1.7;">${section.content}</p>`
            : ''

        case 'button':
          return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px auto;">
             <tr>
               <td style="background: ${NEXUS_COLORS.coral}; border-radius: 8px;">
                 <a href="${section.buttonUrl}" style="display: inline-block; padding: 16px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 600; color: ${NEXUS_COLORS.navyDark}; text-decoration: none;">
                   ${section.buttonText}
                 </a>
               </td>
             </tr>
           </table>`

        case 'registrationDetails':
          return `<div style="border-top: 2px solid ${NEXUS_COLORS.seafoam}; padding-top: 28px; margin-top: 28px;">
             <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 0 0 20px 0;">${section.title || 'Your Registration Details'}</h2>
             ${section.content}
           </div>`

        case 'editLink':
          return section.buttonUrl
            ? `<div style="margin: 32px 0; padding: 24px; background-color: ${NEXUS_COLORS.beige}; border-radius: 12px; border-left: 4px solid ${NEXUS_COLORS.coral};">
               <h3 style="font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 0 0 12px 0;">Need to Make Changes?</h3>
               <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: ${NEXUS_COLORS.gray[600]}; margin: 0 0 16px 0; line-height: 1.6;">
                 You can update your registration information anytime using the link below.
               </p>
               <a href="${section.buttonUrl}" style="display: inline-block; padding: 12px 24px; background-color: ${NEXUS_COLORS.navy}; color: ${NEXUS_COLORS.white}; text-decoration: none; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; font-size: 14px;">
                 Edit My Registration
               </a>
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
    ? `<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: ${NEXUS_COLORS.gray[500]}; margin: 28px 0 0 0; padding-top: 20px; border-top: 1px solid ${NEXUS_COLORS.gray[200]}; line-height: 1.6;">${signature}</p>`
    : ''

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Nexus Retreat</title>
        <style>
          a {
            color: ${NEXUS_COLORS.coral} !important;
            font-weight: bold !important;
            text-decoration: underline !important;
          }
        </style>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: ${NEXUS_COLORS.beige}; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${NEXUS_COLORS.beige};">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
                <!-- Logo/Header Section -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 600; color: ${NEXUS_COLORS.navy}; letter-spacing: -0.5px;">Nexus Retreat</span>
                  </td>
                </tr>
                <!-- Main Content Card -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${NEXUS_COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                      ${headerImageHtml}
                      <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                          ${sectionsHtml}
                          ${signatureHtml}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px;">
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: ${NEXUS_COLORS.gray[400]}; margin: 0 0 8px 0;">
                      Nexus Retreat · Boca Raton, Florida
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: ${NEXUS_COLORS.gray[400]}; margin: 0 0 8px 0;">
                      Questions? Contact us at <a href="mailto:info@nexus-retreat.com" style="color: ${NEXUS_COLORS.coral}; text-decoration: none;">info@nexus-retreat.com</a>
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: ${NEXUS_COLORS.gray[400]}; margin: 0;">
                      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'}/unsubscribe" style="color: ${NEXUS_COLORS.gray[400]}; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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

  const sectionStyle = `background-color: ${NEXUS_COLORS.beige}; border-radius: 12px; padding: 20px; margin-bottom: 16px;`
  const labelStyle = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: ${NEXUS_COLORS.gray[400]}; margin: 0;`
  const valueStyle = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: ${NEXUS_COLORS.navy}; margin: 4px 0 16px 0; font-weight: 500;`
  const headingStyle = `font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 28px 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid ${NEXUS_COLORS.seafoam};`

  // Personal Information
  sections.push(`
    <h3 style="${headingStyle}">Personal Information</h3>
    <div style="${sectionStyle}">
      <p style="${labelStyle}">Name</p>
      <p style="${valueStyle}">${data.first_name || ''} ${data.last_name || ''}</p>
      <p style="${labelStyle}">Email</p>
      <p style="${valueStyle}">${data.email || '-'}</p>
      <p style="${labelStyle}">Phone</p>
      <p style="${valueStyle}">${data.mobile_phone || '-'}</p>
      <p style="${labelStyle}">Title & Organization</p>
      <p style="${valueStyle}; margin-bottom: 0;">${data.title || '-'}${data.organization ? ` at ${data.organization}` : ''}</p>
    </div>
  `)

  // Address
  const addressParts = [
    data.address_line_1,
    data.address_line_2,
    [data.city, data.state, data.zip].filter(Boolean).join(', '),
    data.country,
  ].filter(Boolean)

  sections.push(`
    <h3 style="${headingStyle}">Address</h3>
    <div style="${sectionStyle}">
      <p style="${valueStyle}; margin: 0; line-height: 1.6;">${addressParts.length > 0 ? addressParts.join('<br>') : '-'}</p>
    </div>
  `)

  // Emergency Contact
  sections.push(`
    <h3 style="${headingStyle}">Emergency Contact</h3>
    <div style="${sectionStyle}">
      <p style="${labelStyle}">Name & Relationship</p>
      <p style="${valueStyle}">${data.emergency_contact_name || '-'}${data.emergency_contact_relation ? ` (${data.emergency_contact_relation})` : ''}</p>
      <p style="${labelStyle}">Phone</p>
      <p style="${valueStyle}">${data.emergency_contact_phone || '-'}</p>
      <p style="${labelStyle}">Email</p>
      <p style="${valueStyle}; margin-bottom: 0;">${data.emergency_contact_email || '-'}</p>
    </div>
  `)

  // Executive Assistant
  if (data.assistant_name || data.assistant_email) {
    sections.push(`
      <h3 style="${headingStyle}">Executive Assistant</h3>
      <div style="${sectionStyle}">
        <p style="${labelStyle}">Name</p>
        <p style="${valueStyle}">${data.assistant_name || '-'}${data.assistant_title ? `, ${data.assistant_title}` : ''}</p>
        <p style="${labelStyle}">Email</p>
        <p style="${valueStyle}">${data.assistant_email || '-'}</p>
        <p style="${labelStyle}">Phone</p>
        <p style="${valueStyle}; margin-bottom: 0;">${data.assistant_phone || '-'}</p>
      </div>
    `)
  }

  // Guest Information
  if (data.guest_name || data.guest_email) {
    sections.push(`
      <h3 style="${headingStyle}">Guest Information</h3>
      <div style="${sectionStyle}">
        <p style="${labelStyle}">Guest Name</p>
        <p style="${valueStyle}">${data.guest_name || '-'}${data.guest_relation ? ` (${data.guest_relation})` : ''}</p>
        <p style="${labelStyle}">Guest Email</p>
        <p style="${valueStyle}; margin-bottom: 0;">${data.guest_email || '-'}</p>
      </div>
    `)
  }

  // Event Details
  const listStyle = `margin: 4px 0 0 0; padding-left: 0; list-style: none;`
  const listItemStyle = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: ${NEXUS_COLORS.navy}; padding: 8px 12px; background: ${NEXUS_COLORS.white}; border-radius: 6px; margin-bottom: 6px;`

  const accommodationsHtml =
    data.accommodations && data.accommodations.length > 0
      ? `<ul style="${listStyle}">${data.accommodations.map((acc) => `<li style="${listItemStyle}">${acc.replace('_', ' ')}</li>`).join('')}</ul>`
      : `<p style="${valueStyle}">-</p>`

  const dinnersHtml =
    data.dinner_attendance && data.dinner_attendance.length > 0
      ? `<ul style="${listStyle}">${data.dinner_attendance.map((d) => `<li style="${listItemStyle}">${d.replace('_', ' ')}</li>`).join('')}</ul>`
      : `<p style="${valueStyle}">-</p>`

  const activitiesHtml =
    data.activities && data.activities.length > 0
      ? `<ul style="${listStyle}">${data.activities.map((a) => `<li style="${listItemStyle}">${formatActivityForEmail(a)}</li>`).join('')}</ul>`
      : `<p style="${valueStyle}">-</p>`

  sections.push(`
    <h3 style="${headingStyle}">Event Preferences</h3>
    <div style="${sectionStyle}">
      <p style="${labelStyle}">Dietary Restrictions</p>
      <p style="${valueStyle}">${data.dietary_restrictions || 'None specified'}</p>
      <p style="${labelStyle}">Jacket Size</p>
      <p style="${valueStyle}">${data.jacket_size || '-'}</p>
      <p style="${labelStyle}">Accommodations</p>
      ${accommodationsHtml}
      <p style="${labelStyle}; margin-top: 16px;">Dinner Attendance</p>
      ${dinnersHtml}
      <p style="${labelStyle}; margin-top: 16px;">Activities</p>
      ${activitiesHtml}
    </div>
  `)

  // Guest Event Details
  if (data.guest_name) {
    const guestAccommodationsHtml =
      data.guest_accommodations && data.guest_accommodations.length > 0
        ? `<ul style="${listStyle}">${data.guest_accommodations.map((acc) => `<li style="${listItemStyle}">${acc.replace('_', ' ')}</li>`).join('')}</ul>`
        : `<p style="${valueStyle}">-</p>`

    const guestDinnersHtml =
      data.guest_dinner_attendance && data.guest_dinner_attendance.length > 0
        ? `<ul style="${listStyle}">${data.guest_dinner_attendance.map((d) => `<li style="${listItemStyle}">${d.replace('_', ' ')}</li>`).join('')}</ul>`
        : `<p style="${valueStyle}">-</p>`

    const guestActivitiesHtml =
      data.guest_activities && data.guest_activities.length > 0
        ? `<ul style="${listStyle}">${data.guest_activities.map((a) => `<li style="${listItemStyle}">${formatActivityForEmail(a)}</li>`).join('')}</ul>`
        : `<p style="${valueStyle}">-</p>`

    sections.push(`
      <h3 style="${headingStyle}">Guest Event Preferences</h3>
      <div style="${sectionStyle}">
        <p style="${labelStyle}">Guest Dietary Restrictions</p>
        <p style="${valueStyle}">${data.guest_dietary_restrictions || 'None specified'}</p>
        <p style="${labelStyle}">Guest Jacket Size</p>
        <p style="${valueStyle}">${data.guest_jacket_size || '-'}</p>
        <p style="${labelStyle}">Guest Accommodations</p>
        ${guestAccommodationsHtml}
        <p style="${labelStyle}; margin-top: 16px;">Guest Dinner Attendance</p>
        ${guestDinnersHtml}
        <p style="${labelStyle}; margin-top: 16px;">Guest Activities</p>
        ${guestActivitiesHtml}
      </div>
    `)
  }

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
      bcc: payload.bcc,
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
  heading?: string
  subject: string
  body: string
  headerImageUrl?: string
  cc?: string[]
  bcc?: string[]
  registration?: CustomEmailRegistration
}

export async function sendCustomEmail(params: CustomEmailParams) {
  try {
    const {to, heading, subject, body, headerImageUrl, cc, bcc, registration} = params

    // Build variables from registration if provided, otherwise use empty strings
    const variables: Record<string, string> = registration
      ? {
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
          editLink: registration.editToken ? getEditRegistrationUrl(registration.editToken) : '',
          activitiesLink: registration.editToken ? getEditActivitiesUrl(registration.editToken) : '',
        }
      : {}

    const processedSubject = replaceVariables(subject, variables)
    const processedBody = replaceVariables(body, variables)

    const html = buildCustomEmailHtml({heading, body: processedBody, headerImageUrl})

    return sendEmail({
      from: `Nexus Retreat <${resendEmailFrom}>`,
      to,
      subject: processedSubject,
      html,
      cc,
      bcc,
    })
  } catch (error) {
    console.error('Error sending custom email:', error)
    return {success: false, error}
  }
}

// ============================================================================
// Custom Email HTML Builder (for admin bulk emails)
// ============================================================================

function buildCustomEmailHtml(options: {heading?: string; body: string; headerImageUrl?: string}): string {
  const {heading, body, headerImageUrl} = options

  const headerImageHtml = headerImageUrl
    ? `<tr>
         <td style="padding: 0; line-height: 0; font-size: 0;">
           <img src="${headerImageUrl}" alt="Nexus Retreat" style="width: 100%; height: auto; display: block; border-radius: 16px 16px 0 0;" />
         </td>
       </tr>`
    : ''

  // Style the body content with proper typography
  const styledBody = body
    .replace(/<p>/g, `<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: ${NEXUS_COLORS.gray[600]}; margin: 0 0 16px 0; line-height: 1.7;">`)
    .replace(/<h1>/g, `<h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 0 0 20px 0; line-height: 1.3;">`)
    .replace(/<h2>/g, `<h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 24px 0 16px 0; line-height: 1.3;">`)
    .replace(/<h3>/g, `<h3 style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 20px 0 12px 0; line-height: 1.3;">`)
    .replace(/<strong>/g, `<strong style="color: ${NEXUS_COLORS.navy}; font-weight: 600;">`)
    .replace(/<a /g, `<a style="color: ${NEXUS_COLORS.coral}; font-weight: bold; text-decoration: underline;" `)
    .replace(/<ul>/g, `<ul style="margin: 0 0 16px 0; padding-left: 24px; color: ${NEXUS_COLORS.gray[600]};">`)
    .replace(/<ol>/g, `<ol style="margin: 0 0 16px 0; padding-left: 24px; color: ${NEXUS_COLORS.gray[600]};">`)
    .replace(/<li>/g, `<li style="margin-bottom: 8px; line-height: 1.6;">`)
    .replace(/<blockquote>/g, `<blockquote style="margin: 16px 0; padding: 16px 20px; background: ${NEXUS_COLORS.beige}; border-left: 4px solid ${NEXUS_COLORS.coral}; border-radius: 0 8px 8px 0;">`)

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Nexus Retreat</title>
        <style>
          a {
            color: ${NEXUS_COLORS.coral} !important;
            font-weight: bold !important;
            text-decoration: underline !important;
          }
        </style>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: ${NEXUS_COLORS.beige}; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${NEXUS_COLORS.beige};">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
                ${heading ? `<!-- Logo/Header Section -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 600; color: ${NEXUS_COLORS.navy}; letter-spacing: -0.5px;">${heading}</span>
                  </td>
                </tr>` : ''}
                <!-- Main Content Card -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${NEXUS_COLORS.white}; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                      ${headerImageHtml}
                      <tr>
                        <td style="padding: ${headerImageUrl ? '32px' : '40px'} 40px 32px 40px;">
                          ${styledBody}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px;">
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: ${NEXUS_COLORS.gray[400]}; margin: 0 0 8px 0;">
                      Nexus Retreat · Boca Raton, Florida
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: ${NEXUS_COLORS.gray[400]}; margin: 0 0 8px 0;">
                      Questions? Contact us at <a href="mailto:info@nexus-retreat.com" style="color: ${NEXUS_COLORS.coral}; text-decoration: none;">info@nexus-retreat.com</a>
                    </p>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: ${NEXUS_COLORS.gray[400]}; margin: 0;">
                      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'}/unsubscribe" style="color: ${NEXUS_COLORS.gray[400]}; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

// ============================================================================
// Preview HTML Generator (for admin UI)
// ============================================================================

export function generateEmailPreviewHtml(body: string, heading?: string, headerImageUrl?: string): string {
  return buildCustomEmailHtml({heading, body, headerImageUrl})
}
