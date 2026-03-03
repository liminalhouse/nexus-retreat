import {redirect} from 'next/navigation'
import type {ReactNode} from 'react'
import {getSessionUser} from '@/lib/auth/chatAuth'
import {db} from '@/lib/db'
import {registrations} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
import Avatar from '@/app/components/Avatar'
import ResetPasswordButton from './ResetPasswordButton'
import {
  formatAccommodations,
  formatDinnerAttendance,
  formatActivities,
} from '@/lib/utils/formatRegistrationFields'

export const metadata = {title: 'My Profile'}

function Field({label, value}: {label: string; value: ReactNode}) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 max-w-fit">
        {value || <span className="text-gray-400">—</span>}
      </dd>
    </div>
  )
}

function Section({title, children}: {title: string; children: ReactNode}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 align-start">{children}</dl>
    </section>
  )
}

function FullWidth({children}: {children: ReactNode}) {
  return <div className="sm:col-span-2">{children}</div>
}

export default async function ProfilePage() {
  const user = await getSessionUser()
  if (!user) redirect('/chat/login')

  const [reg] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.id, user.registrationId))
    .limit(1)

  if (!reg) redirect('/chat/login')

  const hasGuest = !!(reg.guestName || reg.guestEmail)
  const hasAssistant = !!(reg.assistantName || reg.assistantEmail)

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-5">
          <Avatar
            src={reg.profilePicture}
            firstName={reg.firstName}
            lastName={reg.lastName}
            size="lg"
          />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              {reg.firstName} {reg.lastName}
            </h1>
            {(reg.title || reg.organization) && (
              <p className="text-sm text-gray-500 mt-0.5">
                {[reg.title, reg.organization].filter(Boolean).join(', ')}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-0.5">{reg.email}</p>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
          <Section title="Personal Details">
            <Field label="First Name" value={reg.firstName} />
            <Field label="Last Name" value={reg.lastName} />
            <Field label="Email" value={reg.email} />
            <Field label="Mobile Phone" value={reg.mobilePhone} />
            <Field label="Title" value={reg.title} />
            <Field label="Organization" value={reg.organization} />
          </Section>

          <Section title="Work Address">
            <FullWidth>
              <Field
                label="Address"
                value={[reg.addressLine1, reg.addressLine2].filter(Boolean).join(', ') || null}
              />
            </FullWidth>
            <Field label="City" value={reg.city} />
            <Field label="State" value={reg.state} />
            <Field label="Zip" value={reg.zip} />
            <Field label="Country" value={reg.country} />
          </Section>

          <Section title="Emergency Contact">
            <Field label="Name" value={reg.emergencyContactName} />
            <Field label="Relation" value={reg.emergencyContactRelation} />
            <Field label="Email" value={reg.emergencyContactEmail} />
            <Field label="Phone" value={reg.emergencyContactPhone} />
          </Section>

          {hasAssistant && (
            <Section title="Executive Assistant">
              <Field label="Name" value={reg.assistantName} />
              <Field label="Title" value={reg.assistantTitle} />
              <Field label="Email" value={reg.assistantEmail} />
              <Field label="Phone" value={reg.assistantPhone} />
            </Section>
          )}

          <Section title="Event Details">
            <FullWidth>
              <Field label="Dietary Restrictions" value={reg.dietaryRestrictions} />
            </FullWidth>
            <Field label="Jacket Size" value={reg.jacketSize} />
            <FullWidth>
              <Field label="Accommodations" value={formatAccommodations(reg.accommodations)} />
            </FullWidth>
            <FullWidth>
              <Field
                label="Dinner Attendance"
                value={formatDinnerAttendance(reg.dinnerAttendance)}
              />
            </FullWidth>
            <FullWidth>
              <Field label="Activities" value={formatActivities(reg.activities)} />
            </FullWidth>
          </Section>

          {hasGuest && (
            <Section title="Guest Information">
              <Field label="Name" value={reg.guestName} />
              <Field label="Relation" value={reg.guestRelation} />
              <Field label="Email" value={reg.guestEmail} />
            </Section>
          )}

          {hasGuest && (
            <Section title="Guest Event Details">
              <FullWidth>
                <Field label="Guest Dietary Restrictions" value={reg.guestDietaryRestrictions} />
              </FullWidth>
              <Field label="Guest Jacket Size" value={reg.guestJacketSize} />
              <FullWidth>
                <Field
                  label="Guest Accommodations"
                  value={formatAccommodations(reg.guestAccommodations)}
                />
              </FullWidth>
              <FullWidth>
                <Field
                  label="Guest Dinner Attendance"
                  value={formatDinnerAttendance(reg.guestDinnerAttendance)}
                />
              </FullWidth>
              <FullWidth>
                <Field label="Guest Activities" value={formatActivities(reg.guestActivities)} />
              </FullWidth>
            </Section>
          )}

          {/* Reset password */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm mb-2">Need to reset your password?</p>
            <ResetPasswordButton email={reg.email} />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm">
              If you need any assistance, don&apos;t hesitate to contact{' '}
              <a className="text-blue-800 hover:underline" href="mailto:info@nexus-retreat.com">
                info@nexus-retreat.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
