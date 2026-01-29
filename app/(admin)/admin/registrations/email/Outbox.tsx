'use client'

import {useState, useEffect} from 'react'
import {format} from 'date-fns'

type ResendEmail = {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  html?: string
  text?: string
  created_at: string
  last_event: string
}

type EmailDetails = {
  [id: string]: ResendEmail | null | 'loading'
}

export default function Outbox() {
  const [emails, setEmails] = useState<ResendEmail[]>([])
  const [emailDetails, setEmailDetails] = useState<EmailDetails>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchEmails()
  }, [])

  // Fetch full email details when expanded
  useEffect(() => {
    if (expandedId && !emailDetails[expandedId]) {
      fetchEmailDetails(expandedId)
    }
  }, [expandedId])

  const fetchEmails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/sent-emails')
      const data = await response.json()

      if (data.success) {
        setEmails(data.emails)
      } else {
        setError(data.error || 'Failed to fetch emails')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emails')
    } finally {
      setLoading(false)
    }
  }

  const fetchEmailDetails = async (id: string) => {
    setEmailDetails((prev) => ({...prev, [id]: 'loading'}))
    try {
      const response = await fetch(`/api/sent-emails/${id}`)
      const data = await response.json()

      if (data.success) {
        setEmailDetails((prev) => ({...prev, [id]: data.email}))
      } else {
        setEmailDetails((prev) => ({...prev, [id]: null}))
      }
    } catch (err) {
      setEmailDetails((prev) => ({...prev, [id]: null}))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'opened':
        return 'bg-purple-100 text-purple-800'
      case 'clicked':
        return 'bg-indigo-100 text-indigo-800'
      case 'bounced':
        return 'bg-red-100 text-red-800'
      case 'complained':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="ml-3 text-gray-600">Loading sent emails...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Failed to load emails</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchEmails}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12">
        <div className="text-center">
          <svg
            className="h-16 w-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No emails sent yet</p>
          <p className="text-gray-400 text-sm mt-2">Emails you send will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sent Emails</h2>
          <p className="text-sm text-gray-500">{emails.length} emails</p>
        </div>
        <button
          onClick={fetchEmails}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="Refresh"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {emails.map((email) => {
          const details = emailDetails[email.id]
          const isExpanded = expandedId === email.id
          const isLoadingDetails = details === 'loading'
          const fullEmail = typeof details === 'object' && details !== null ? details : null

          return (
            <div key={email.id} className="hover:bg-gray-50">
              <button
                className="w-full p-4 text-left"
                onClick={() => setExpandedId(isExpanded ? null : email.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(email.last_event)}`}
                      >
                        {email.last_event}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(email.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{email.subject}</p>
                    <p className="text-sm text-gray-500 truncate">To: {email.to.join(', ')}</p>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0">
                  {isLoadingDetails ? (
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">Loading details...</span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-4">
                      {/* Email metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="font-medium text-gray-900">{email.from}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">ID:</span>
                          <p className="font-mono text-xs text-gray-600">{email.id}</p>
                        </div>
                      </div>

                      {/* To recipients */}
                      <div>
                        <span className="text-gray-500">To:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {email.to.map((recipient, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-gray-200 text-xs"
                            >
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CC recipients */}
                      {fullEmail?.cc && fullEmail.cc.length > 0 && (
                        <div>
                          <span className="text-gray-500">CC:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {fullEmail.cc.map((recipient, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-800"
                              >
                                {recipient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BCC recipients */}
                      {fullEmail?.bcc && fullEmail.bcc.length > 0 && (
                        <div>
                          <span className="text-gray-500">BCC:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {fullEmail.bcc.map((recipient, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 border border-gray-300 text-xs"
                              >
                                {recipient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Email body */}
                      {fullEmail?.html && (
                        <div>
                          <span className="text-gray-500">Message:</span>
                          <div
                            className="mt-2 bg-white border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{__html: fullEmail.html}}
                          />
                        </div>
                      )}

                      {/* Fallback to text if no HTML */}
                      {!fullEmail?.html && fullEmail?.text && (
                        <div>
                          <span className="text-gray-500">Message:</span>
                          <div className="mt-2 bg-white border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
                            {fullEmail.text}
                          </div>
                        </div>
                      )}

                      {/* If no details loaded yet, show basic info */}
                      {!fullEmail && !isLoadingDetails && (
                        <p className="text-gray-500 text-xs">
                          Could not load full email details
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
