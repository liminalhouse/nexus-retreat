'use client'

import {useState, useEffect} from 'react'
import RichTextEditor from './RichTextEditor'

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

type EmailTemplate = {
  _id: string
  name: string
  type: string
  subject: string
  greeting: string
  bodyIntroText: string
  bodyOutroText: string
  signature: string | null
}

export default function EmailComposer({
  subject,
  setSubject,
  body,
  setBody,
  headerImageUrl,
  setHeaderImageUrl,
  ccOptions,
  setCcOptions,
  selectedCount,
  isSending,
  onSend,
  sendResults,
  onClearResults,
}: {
  subject: string
  setSubject: (subject: string) => void
  body: string
  setBody: (body: string) => void
  headerImageUrl: string
  setHeaderImageUrl: (url: string) => void
  ccOptions: CCOptions
  setCcOptions: (options: CCOptions) => void
  selectedCount: number
  isSending: boolean
  onSend: () => void
  sendResults: {
    total: number
    successCount: number
    failCount: number
    results: SendResult[]
  } | null
  onClearResults: () => void
}) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [showHeaderImage, setShowHeaderImage] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Fetch templates on mount
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/email-templates')
        const data = await response.json()
        setTemplates(data.templates || [])
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoadingTemplates(false)
      }
    }
    fetchTemplates()
  }, [])

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)

    if (!templateId) {
      return
    }

    const template = templates.find((t) => t._id === templateId)
    if (template) {
      setSubject(template.subject)

      // Build body from template parts
      let bodyContent = ''
      if (template.greeting) {
        bodyContent += `<p>${template.greeting}</p>`
      }
      if (template.bodyIntroText) {
        bodyContent += `<p>${template.bodyIntroText}</p>`
      }
      if (template.bodyOutroText) {
        bodyContent += `<p>${template.bodyOutroText}</p>`
      }
      if (template.signature) {
        bodyContent += `<p>${template.signature}</p>`
      }
      setBody(bodyContent)
    }
  }

  const handleHeaderImageChange = (url: string) => {
    setHeaderImageUrl(url)
    setImageError(false)
  }

  const canSend = selectedCount > 0 && subject.trim() && body.trim() && !isSending

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Compose Email</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Send Results */}
        {sendResults && (
          <div
            className={`p-4 rounded-md ${
              sendResults.failCount === 0
                ? 'bg-green-50 border border-green-200'
                : sendResults.successCount === 0
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {sendResults.failCount === 0
                    ? 'All emails sent successfully!'
                    : sendResults.successCount === 0
                      ? 'Failed to send emails'
                      : 'Some emails failed to send'}
                </p>
                <p className="text-sm mt-1">
                  {sendResults.successCount} of {sendResults.total} emails sent successfully
                </p>
                {sendResults.failCount > 0 && (
                  <ul className="mt-2 text-sm">
                    {sendResults.results
                      .filter((r) => !r.success)
                      .map((r, i) => (
                        <li key={i} className="text-red-600">
                          {r.email}: {r.error}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <button onClick={onClearResults} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Template Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Load Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            disabled={loadingTemplates}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {loadingTemplates ? 'Loading templates...' : 'Select a template (optional)'}
            </option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Header Image */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Header Image</label>
            <button
              type="button"
              onClick={() => setShowHeaderImage(!showHeaderImage)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {showHeaderImage ? 'Hide' : 'Add header image'}
            </button>
          </div>
          {showHeaderImage && (
            <div className="space-y-2">
              <input
                type="url"
                value={headerImageUrl}
                onChange={(e) => handleHeaderImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {headerImageUrl && !imageError && (
                <div className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                  <img
                    src={headerImageUrl}
                    alt="Header preview"
                    className="w-full h-32 object-cover"
                    onError={() => setImageError(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setHeaderImageUrl('')}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {imageError && (
                <p className="text-xs text-red-500">Failed to load image. Please check the URL.</p>
              )}
              <p className="text-xs text-gray-500">
                Enter a URL to an image that will appear at the top of the email
              </p>
            </div>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <RichTextEditor content={body} onChange={setBody} />
          <p className="mt-2 text-xs text-gray-500">
            Type <code className="bg-gray-100 px-1 rounded">@</code> to see all available
            variables, or click the <code className="bg-gray-100 px-1 rounded">{'{{}}'}</code>{' '}
            button in the toolbar
          </p>
        </div>

        {/* CC Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CC Options</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ccOptions.assistants}
                onChange={(e) => setCcOptions({...ccOptions, assistants: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">CC Executive Assistants</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ccOptions.guests}
                onChange={(e) => setCcOptions({...ccOptions, guests: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">CC Guests</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ccOptions.infoEmail}
                onChange={(e) => setCcOptions({...ccOptions, infoEmail: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">CC info@nexus-retreat.com</span>
            </label>
          </div>
        </div>

        {/* Send Button */}
        <div className="pt-4">
          <button
            onClick={onSend}
            disabled={!canSend}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              canSend ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                Sending...
              </span>
            ) : (
              `Send to ${selectedCount} Recipient${selectedCount !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
