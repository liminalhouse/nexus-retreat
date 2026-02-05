'use client'

import {useState} from 'react'
import RecipientList from './RecipientList'
import EmailComposer, {RecipientFields} from './EmailComposer'
import Outbox from './Outbox'
import {PaperAirplaneIcon, PencilSquareIcon} from '@heroicons/react/24/outline'
import type {Registration} from '@/lib/db/schema'
import type {EmailRecipient, PredefinedRecipient} from './EmailRecipientField'

type SendResult = {
  email: string
  success: boolean
  error?: string
  skipped?: boolean
}

type Tab = 'compose' | 'outbox'

export default function EmailPageClient({registrations, unsubscribedEmails}: {registrations: Registration[]; unsubscribedEmails: string[]}) {
  const [activeTab, setActiveTab] = useState<Tab>('compose')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [heading, setHeading] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [headerImageUrl, setHeaderImageUrl] = useState('')
  const [recipientFields, setRecipientFields] = useState<RecipientFields>({
    to: [{type: 'predefined', value: 'registrants', label: 'Registrants'}],
    cc: [{type: 'predefined', value: 'info_email', label: 'info@nexus-retreat.com'}],
    bcc: [],
  })
  const [isSending, setIsSending] = useState(false)
  const [sendResults, setSendResults] = useState<{
    total: number
    successCount: number
    skippedCount: number
    failCount: number
    results: SendResult[]
  } | null>(null)

  // Helper to extract predefined recipient types from a field
  const getPredefinedTypes = (recipients: EmailRecipient[]): PredefinedRecipient[] => {
    return recipients
      .filter((r): r is EmailRecipient & {type: 'predefined'} => r.type === 'predefined')
      .map((r) => r.value)
  }

  // Helper to extract custom emails from a field
  const getCustomEmails = (recipients: EmailRecipient[]): string[] => {
    return recipients
      .filter((r): r is EmailRecipient & {type: 'custom'} => r.type === 'custom')
      .map((r) => r.value)
  }

  const handleSend = async () => {
    if (recipientFields.to.length === 0 || !subject.trim() || !body.trim()) {
      return
    }

    setIsSending(true)
    setSendResults(null)

    try {
      const response = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationIds: Array.from(selectedIds),
          heading: heading.trim() || undefined,
          subject,
          body,
          headerImageUrl: headerImageUrl.trim() || undefined,
          recipientFields: {
            to: {
              predefined: getPredefinedTypes(recipientFields.to),
              custom: getCustomEmails(recipientFields.to),
            },
            cc: {
              predefined: getPredefinedTypes(recipientFields.cc),
              custom: getCustomEmails(recipientFields.cc),
            },
            bcc: {
              predefined: getPredefinedTypes(recipientFields.bcc),
              custom: getCustomEmails(recipientFields.bcc),
            },
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSendResults({
          total: data.total,
          successCount: data.successCount,
          skippedCount: data.skippedCount || 0,
          failCount: data.failCount,
          results: data.results,
        })
      } else {
        setSendResults({
          total: 0,
          successCount: 0,
          skippedCount: 0,
          failCount: 1,
          results: [{email: 'N/A', success: false, error: data.error}],
        })
      }
    } catch (error) {
      setSendResults({
        total: 0,
        successCount: 0,
        skippedCount: 0,
        failCount: 1,
        results: [
          {
            email: 'N/A',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(registrations.map((r) => r.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedIds(newSet)
  }

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compose'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <PencilSquareIcon stroke="currentColor" className="w-5 h-5" /> Compose
            </span>
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'outbox'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <PaperAirplaneIcon stroke="currentColor" className="w-5 h-5" />
              Sent
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Recipients (40%) */}
          <div className="lg:col-span-2">
            <RecipientList
              registrations={registrations}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              unsubscribedEmails={unsubscribedEmails}
            />
          </div>

          {/* Right Panel - Email Composer (60%) */}
          <div className="lg:col-span-3">
            <EmailComposer
              heading={heading}
              setHeading={setHeading}
              subject={subject}
              setSubject={setSubject}
              body={body}
              setBody={setBody}
              headerImageUrl={headerImageUrl}
              setHeaderImageUrl={setHeaderImageUrl}
              recipientFields={recipientFields}
              setRecipientFields={setRecipientFields}
              selectedCount={selectedIds.size}
              isSending={isSending}
              onSend={handleSend}
              sendResults={sendResults}
              onClearResults={() => setSendResults(null)}
              previewRegistration={
                selectedIds.size > 0
                  ? registrations.find((r) => selectedIds.has(r.id)) || null
                  : null
              }
            />
          </div>
        </div>
      ) : (
        <Outbox />
      )}
    </div>
  )
}
