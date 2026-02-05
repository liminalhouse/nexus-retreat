'use client'

import {useMemo} from 'react'
import type {Registration} from '@/lib/db/schema'
import {
  EMAIL_COLORS,
  EMAIL_FONTS,
  applyEmailStyles,
  replaceEmailVariables,
} from '@/lib/email/emailStyles'

type EmailPreviewProps = {
  body: string
  heading?: string
  headerImageUrl?: string
  registration: Registration | null
}

// Helper to format array fields as comma-separated strings
function formatArray(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return ''
  return arr.join(', ')
}

// Build variables map from registration data
function buildVariablesMap(registration: Registration | null): Record<string, string> {
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

    // Executive Assistant
    assistantName: registration.assistantName || '',
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
}: EmailPreviewProps) {
  const variables = useMemo(() => buildVariablesMap(registration), [registration])

  const processedBody = useMemo(() => replaceEmailVariables(body, variables), [body, variables])

  const styledBody = useMemo(() => applyEmailStyles(processedBody), [processedBody])

  return (
    <div className="bg-nexus-beige p-6 rounded-lg min-h-[500px]">
      <div className="max-w-[600px] mx-auto">
        {/* Logo/Heading */}
        {heading && (
          <div className="text-center pb-6">
            <span
              style={{
                fontFamily: EMAIL_FONTS.serif,
                fontSize: '28px',
                fontWeight: 600,
                color: EMAIL_COLORS.navy,
                letterSpacing: '-0.5px',
              }}
            >
              {heading}
            </span>
          </div>
        )}

        {/* Main Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: EMAIL_COLORS.white,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          }}
        >
          {headerImageUrl && (
            <img src={headerImageUrl} alt="Email header" className="w-full h-auto" />
          )}

          {/* Body */}
          <div className="px-10 py-8">
            {processedBody ? (
              <div dangerouslySetInnerHTML={{__html: styledBody}} />
            ) : (
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p
            style={{
              fontFamily: EMAIL_FONTS.sans,
              fontSize: '13px',
              color: EMAIL_COLORS.gray[400],
              margin: '0 0 8px 0',
            }}
          >
            Nexus Retreat · Boca Raton, Florida
          </p>
          <p
            style={{
              fontFamily: EMAIL_FONTS.sans,
              fontSize: '12px',
              color: EMAIL_COLORS.gray[400],
              margin: '0 0 8px 0',
            }}
          >
            Questions? Contact us at{' '}
            <span style={{color: EMAIL_COLORS.coral}}>info@nexus-retreat.com</span>
          </p>
          <p
            style={{
              fontFamily: EMAIL_FONTS.sans,
              fontSize: '11px',
              color: EMAIL_COLORS.gray[400],
              margin: 0,
            }}
          >
            <a
              href="/unsubscribe"
              style={{color: EMAIL_COLORS.gray[400], textDecoration: 'underline'}}
            >
              Click here to unsubscribe
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
