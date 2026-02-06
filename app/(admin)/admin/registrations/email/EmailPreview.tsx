'use client'

import {useMemo} from 'react'
import type {Registration} from '@/lib/db/schema'
import {EMAIL_COLORS, EMAIL_FONTS, replaceEmailVariables} from '@/lib/email/emailStyles'
import {buildCustomEmailHtml} from '@/lib/email/buildCustomEmailHtml'

type EmailPreviewProps = {
  body: string
  heading?: string
  headerImageUrl?: string
  registration: Registration | null
  assistantFallbackToRegistrant?: boolean
}

// Helper to format array fields as comma-separated strings
function formatArray(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return ''
  return arr.join(', ')
}

// Build variables map from registration data
function buildVariablesMap(registration: Registration | null, assistantFallbackToRegistrant = false): Record<string, string> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // Always provide link placeholders so they render as valid links
  if (!registration) {
    return {
      editLink: '#',
      activitiesLink: '#',
    }
  }

  return {
    // Basic Info
    firstName: registration.firstName,
    lastName: registration.lastName,
    fullName: `${registration.firstName} ${registration.lastName}`,
    email: registration.email,
    mobilePhone: registration.mobilePhone || '',
    title: registration.title || '',
    organization: registration.organization || '',

    // Address
    addressLine1: registration.addressLine1 || '',
    addressLine2: registration.addressLine2 || '',
    city: registration.city || '',
    state: registration.state || '',
    zip: registration.zip || '',
    country: registration.country || '',

    // Emergency Contact
    emergencyContactName: registration.emergencyContactName || '',
    emergencyContactRelation: registration.emergencyContactRelation || '',
    emergencyContactEmail: registration.emergencyContactEmail || '',
    emergencyContactPhone: registration.emergencyContactPhone || '',

    // Executive Assistant — fall back to registrant name when assistant is in TO and no assistant exists
    assistantName: registration.assistantName
      || (assistantFallbackToRegistrant ? `${registration.firstName} ${registration.lastName}` : ''),
    assistantFirstName: registration.assistantName
      ? registration.assistantName.split(' ')[0]
      : (assistantFallbackToRegistrant ? registration.firstName : ''),
    assistantLastName: registration.assistantName
      ? registration.assistantName.split(' ').slice(1).join(' ')
      : (assistantFallbackToRegistrant ? registration.lastName : ''),
    assistantTitle: registration.assistantTitle || '',
    assistantEmail: registration.assistantEmail || '',
    assistantPhone: registration.assistantPhone || '',

    // Guest
    guestName: registration.guestName || '',
    guestRelation: registration.guestRelation || '',
    guestEmail: registration.guestEmail || '',

    // Event Details
    dietaryRestrictions: registration.dietaryRestrictions || '',
    jacketSize: registration.jacketSize || '',
    accommodations: formatArray(registration.accommodations),
    dinnerAttendance: formatArray(registration.dinnerAttendance),
    activities: formatArray(registration.activities),

    // Guest Event Details
    guestDietaryRestrictions: registration.guestDietaryRestrictions || '',
    guestJacketSize: registration.guestJacketSize || '',
    guestAccommodations: formatArray(registration.guestAccommodations),
    guestDinnerAttendance: formatArray(registration.guestDinnerAttendance),
    guestActivities: formatArray(registration.guestActivities),

    // Links
    editLink: `${baseUrl}/edit-registration/${registration.editToken}`,
    activitiesLink: `${baseUrl}/edit-registration/${registration.editToken}/activities`,
  }
}

export default function EmailPreview({
  body,
  heading,
  headerImageUrl,
  registration,
  assistantFallbackToRegistrant = false,
}: EmailPreviewProps) {
  const variables = useMemo(() => buildVariablesMap(registration, assistantFallbackToRegistrant), [registration, assistantFallbackToRegistrant])
  const processedBody = useMemo(() => replaceEmailVariables(body, variables), [body, variables])

  // Build the exact same HTML that gets sent
  const html = useMemo(() => {
    if (!processedBody) return null
    return buildCustomEmailHtml({heading, body: processedBody, headerImageUrl})
  }, [processedBody, heading, headerImageUrl])

  if (!html) {
    return (
      <div className="bg-nexus-beige p-6 rounded-lg min-h-[500px] flex items-center justify-center">
        <p
          style={{
            fontFamily: EMAIL_FONTS.sans,
            fontSize: '15px',
            color: EMAIL_COLORS.gray[400],
            fontStyle: 'italic',
          }}
        >
          Email body will appear here...
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg overflow-hidden min-h-[500px]"
      dangerouslySetInnerHTML={{__html: html}}
    />
  )
}
