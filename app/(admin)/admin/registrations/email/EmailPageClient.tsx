'use client'

import {useState} from 'react'
import RecipientList from './RecipientList'
import EmailComposer from './EmailComposer'
import Outbox from './Outbox'

type RegistrationForEmail = {
  id: string
  email: string
  first_name: string
  last_name: string
  profile_picture: string | null
  assistant_email: string | null
  guest_email: string | null
}

type CCOptions = {
  assistants: boolean
  guests: boolean
  infoEmail: boolean
}

type SendResult = {
  email: string
  success: boolean
  error?: string
}

type Tab = 'compose' | 'outbox'

export default function EmailPageClient({
  registrations,
}: {
  registrations: RegistrationForEmail[]
}) {
  const [activeTab, setActiveTab] = useState<Tab>('compose')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [headerImageUrl, setHeaderImageUrl] = useState('')
  const [ccOptions, setCcOptions] = useState<CCOptions>({
    assistants: false,
    guests: false,
    infoEmail: true,
  })
  const [isSending, setIsSending] = useState(false)
  const [sendResults, setSendResults] = useState<{
    total: number
    successCount: number
    failCount: number
    results: SendResult[]
  } | null>(null)

  const handleSend = async () => {
    if (selectedIds.size === 0 || !subject.trim() || !body.trim()) {
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
          subject,
          body,
          headerImageUrl: headerImageUrl.trim() || undefined,
          ccOptions,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSendResults({
          total: data.total,
          successCount: data.successCount,
          failCount: data.failCount,
          results: data.results,
        })
      } else {
        setSendResults({
          total: 0,
          successCount: 0,
          failCount: selectedIds.size,
          results: [{email: 'N/A', success: false, error: data.error}],
        })
      }
    } catch (error) {
      setSendResults({
        total: 0,
        successCount: 0,
        failCount: selectedIds.size,
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Compose
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
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
            />
          </div>

          {/* Right Panel - Email Composer (60%) */}
          <div className="lg:col-span-3">
            <EmailComposer
              subject={subject}
              setSubject={setSubject}
              body={body}
              setBody={setBody}
              headerImageUrl={headerImageUrl}
              setHeaderImageUrl={setHeaderImageUrl}
              ccOptions={ccOptions}
              setCcOptions={setCcOptions}
              selectedCount={selectedIds.size}
              isSending={isSending}
              onSend={handleSend}
              sendResults={sendResults}
              onClearResults={() => setSendResults(null)}
            />
          </div>
        </div>
      ) : (
        <Outbox />
      )}
    </div>
  )
}
