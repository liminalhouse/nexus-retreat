import {Resend} from 'resend'
import {client} from '@/sanity/lib/client'
import {toPlainText} from '@portabletext/react'

const resend = new Resend(process.env.RESEND_API_KEY)

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
  bodyIntro: any[]
  bodyOutro: any[]
  signature: string
}

type RegistrationData = {
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

const resendEmailFrom = process.env.RESEND_FROM_EMAIL || 'noreply@noreply.nexus-retreat.com'

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

function replaceVariables(text: string, data: Record<string, any>): string {
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
      ? `<ul style="margin: 4px 0; padding-left: 20px;">${data.activities.map((a) => `<li>${a.replace(/_/g, ' ')}</li>`).join('')}</ul>`
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
      ? `<ul style="margin: 4px 0; padding-left: 20px;">${data.guest_activities.map((a) => `<li>${a.replace(/_/g, ' ')}</li>`).join('')}</ul>`
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

export async function sendActivitySelectionEmail(data: RegistrationData) {
  try {
    // Fetch template from Sanity
    const template = await getEmailTemplate('activity_selection')

    if (!template) {
      console.error('Activity selection email template not found in Sanity')
      throw new Error(
        'Activity selection email template not found in Sanity. Please create an active email template with type "activity_selection".',
      )
    }

    // Replace variables in template
    const variables = {
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`,
    }

    const subject = replaceVariables(template.subject, variables)
    const greeting = replaceVariables(template.greeting, variables)

    // Convert portable text to plain text for intro and outro
    const bodyIntroText = template.bodyIntro ? toPlainText(template.bodyIntro) : ''
    const bodyOutroText = template.bodyOutro ? toPlainText(template.bodyOutro) : ''

    // Generate edit activities link using edit token
    const editActivitiesLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'}/edit-registration/${data.editToken}/activities`

    const editActivitiesLinkHtml = `<div style="margin: 32px 0; text-align: center;">
           <a href="${editActivitiesLink}" style="display: inline-block; padding: 14px 32px; background-color: #0369a1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
             Select Your Activities
           </a>
         </div>`

    // Generate header image HTML if present
    const headerImageHtml = template.headerImage?.asset?.url
      ? `<div style="margin-bottom: 24px; text-align: center;">
           <img src="${template.headerImage.asset.url}" alt="${template.headerImage.alt || 'Email header'}" style="max-width: 100%; height: auto; border-radius: 8px;" />
         </div>`
      : ''

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; padding: 32px; border-radius: 8px;">
            ${headerImageHtml}
            <p style="font-size: 16px; margin-bottom: 16px; white-space: pre-line;">${greeting}</p>

            ${bodyIntroText ? `<p style="font-size: 14px; color: #374151; margin-bottom: 24px; white-space: pre-line;">${bodyIntroText}</p>` : ''}

            ${editActivitiesLinkHtml}

            ${bodyOutroText ? `<p style="font-size: 14px; color: #374151; margin-top: 24px; white-space: pre-line;">${bodyOutroText}</p>` : ''}

            ${template.signature ? `<p style="font-size: 14px; color: #374151; margin-top: 24px; white-space: pre-line;">${template.signature}</p>` : ''}
          </div>
        </body>
      </html>
    `

    // Build CC list: guest, assistant, and info@nexus-retreat.com
    const cc: string[] = ['info@nexus-retreat.com']
    if (data.assistant_email && data.assistant_email !== data.email) {
      cc.push(data.assistant_email)
    }
    if (data.guest_email && data.guest_email !== data.email && data.guest_email !== 'info@nexus-retreat.com') {
      cc.push(data.guest_email)
    }

    // Send email using Resend
    const emailData: any = {
      from: `Nexus Retreat <${resendEmailFrom}>`,
      to: data.email,
      subject,
      html,
      cc,
    }

    console.log('Sending activity selection email via Resend...', {
      from: emailData.from,
      to: emailData.to,
      cc: emailData.cc,
      subject: emailData.subject,
    })

    const response = await resend.emails.send(emailData)

    return {success: true, data: response}
  } catch (error) {
    console.error('Error sending activity selection email:', error)
    return {success: false, error}
  }
}

export async function sendRegistrationConfirmation(data: RegistrationData) {
  try {
    // Fetch template from Sanity
    const template = await getEmailTemplate('registration_confirmation')

    if (!template) {
      console.error('Email template not found in Sanity')
      throw new Error(
        'Registration confirmation email template not found in Sanity. Please create an active email template with type "registration_confirmation".',
      )
    }

    // Replace variables in template
    const variables = {
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`,
    }

    const subject = replaceVariables(template.subject, variables)
    const greeting = replaceVariables(template.greeting, variables)

    // Convert portable text to plain text for intro and outro
    const bodyIntroText = template.bodyIntro ? toPlainText(template.bodyIntro) : ''
    const bodyOutroText = template.bodyOutro ? toPlainText(template.bodyOutro) : ''

    // Build email HTML
    const registrationDetails = formatRegistrationDetails(data)

    // Generate edit link if editToken is present
    const editLink = data.editToken
      ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'}/edit-registration/${data.editToken}`
      : ''

    const editLinkHtml = editLink
      ? `<div style="margin: 32px 0; padding: 24px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0369a1;">
           <h3 style="font-size: 16px; font-weight: 600; color: #0369a1; margin: 0 0 12px 0;">Need to Make Changes?</h3>
           <p style="font-size: 14px; color: #374151; margin: 0 0 16px 0;">
             If you need to update your registration information, you can use the link below:
           </p>
           <a href="${editLink}" style="display: inline-block; padding: 12px 24px; background-color: #0369a1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
             Edit My Registration
           </a>
           <p style="font-size: 12px; color: #6b7280; margin: 16px 0 0 0;">
             This link is unique to your registration and can be used at any time.
           </p>
         </div>`
      : ''

    // Generate header image HTML if present
    const headerImageHtml = template.headerImage?.asset?.url
      ? `<div style="margin-bottom: 24px; text-align: center;">
           <img src="${template.headerImage.asset.url}" alt="${template.headerImage.alt || 'Email header'}" style="max-width: 100%; height: auto; border-radius: 8px;" />
         </div>`
      : ''

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; padding: 32px; border-radius: 8px;">
            ${headerImageHtml}
            <p style="font-size: 16px; margin-bottom: 16px; white-space: pre-line;">${greeting}</p>

            ${bodyIntroText ? `<p style="font-size: 14px; color: #374151; margin-bottom: 24px; white-space: pre-line;">${bodyIntroText}</p>` : ''}

            <div style="border-top: 2px solid #e5e7eb; padding-top: 24px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px;">Your Registration Details</h2>
              ${registrationDetails}
            </div>

            ${editLinkHtml}

            ${bodyOutroText ? `<p style="font-size: 14px; color: #374151; margin-top: 24px; white-space: pre-line;">${bodyOutroText}</p>` : ''}

            ${template.signature ? `<p style="font-size: 14px; color: #374151; margin-top: 24px; white-space: pre-line;">${template.signature}</p>` : ''}
          </div>
        </body>
      </html>
    `

    // Build CC list (exclude the primary email to avoid duplicates)
    const cc: string[] = []
    if (data.assistant_email && data.assistant_email !== data.email) {
      cc.push(data.assistant_email)
    }
    if (data.guest_email && data.guest_email !== data.email) {
      cc.push(data.guest_email)
    }

    // Send email using Resend
    const emailData: any = {
      from: `Nexus Retreat <${resendEmailFrom}>`,
      to: data.email,
      subject,
      html,
    }

    if (cc.length > 0) {
      emailData.cc = cc
    }

    // Use editToken as idempotency key to prevent duplicate emails
    const headers: Record<string, string> = {}
    if (data.editToken) {
      headers['Idempotency-Key'] = `registration-${data.editToken}`
    }

    console.log('Sending email via Resend...', {
      from: emailData.from,
      to: emailData.to,
      cc: emailData.cc,
      subject: emailData.subject,
      idempotencyKey: headers['Idempotency-Key'],
    })

    const response = await resend.emails.send(emailData, {
      headers,
    })

    return {success: true, data: response}
  } catch (error) {
    console.error('Error sending registration confirmation email:', error)
    return {success: false, error}
  }
}
