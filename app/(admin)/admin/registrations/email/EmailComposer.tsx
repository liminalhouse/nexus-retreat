'use client'

import {useState, useEffect} from 'react'
import type {Registration} from '@/lib/db/schema'
import RichTextEditor from './RichTextEditor'
import EmailPreview from './EmailPreview'
import EmailRecipientField, {EmailRecipient, PredefinedRecipient} from './EmailRecipientField'

// ============================================================================
// Types
// ============================================================================

export type RecipientFields = {
  to: EmailRecipient[]
  cc: EmailRecipient[]
  bcc: EmailRecipient[]
}

type SendResult = {
  email: string
  success: boolean
  error?: string
}

type SendResults = {
  total: number
  successCount: number
  failCount: number
  results: SendResult[]
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

type Tab = 'compose' | 'preview'

type EmailComposerProps = {
  subject: string
  setSubject: (subject: string) => void
  body: string
  setBody: (body: string) => void
  headerImageUrl: string
  setHeaderImageUrl: (url: string) => void
  recipientFields: RecipientFields
  setRecipientFields: (fields: RecipientFields) => void
  selectedCount: number
  isSending: boolean
  onSend: () => void
  sendResults: SendResults | null
  onClearResults: () => void
  previewRegistration: Registration | null
}

// ============================================================================
// Sub-components
// ============================================================================

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
        active ? 'text-nexus-navy' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        {icon}
        {label}
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-coral" />}
    </button>
  )
}

function SendButton({
  canSend,
  isSending,
  selectedCount,
  onClick,
}: {
  canSend: boolean
  isSending: boolean
  selectedCount: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canSend}
      className={`w-full py-3 px-4 rounded-md font-medium ${
        canSend
          ? 'bg-nexus-coral hover:bg-nexus-coral-light text-nexus-navy-dark'
          : 'bg-gray-300 text-white cursor-not-allowed'
      }`}
    >
      {isSending ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner />
          Sending...
        </span>
      ) : (
        `Send to ${selectedCount} Recipient${selectedCount !== 1 ? 's' : ''}`
      )}
    </button>
  )
}

function LoadingSpinner({className = 'h-5 w-5'}: {className?: string}) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function PreviewInfoBanner({registration}: {registration: Registration | null}) {
  if (registration) {
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Preview for:</span> {registration.firstName}{' '}
          {registration.lastName} ({registration.email})
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Variables like {`{{firstName}}`} are replaced with this recipient&apos;s data
        </p>
      </div>
    )
  }

  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-sm text-amber-800">
        Select a recipient to see variable replacements in the preview
      </p>
    </div>
  )
}

function SendResultsBanner({
  results,
  onClear,
}: {
  results: SendResults
  onClear: () => void
}) {
  const variant =
    results.failCount === 0
      ? 'success'
      : results.successCount === 0
        ? 'error'
        : 'warning'

  const styles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }

  const message =
    results.failCount === 0
      ? 'All emails sent successfully!'
      : results.successCount === 0
        ? 'Failed to send emails'
        : 'Some emails failed to send'

  return (
    <div className={`p-4 rounded-md border ${styles[variant]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-sm mt-1">
            {results.successCount} of {results.total} emails sent successfully
          </p>
          {results.failCount > 0 && (
            <ul className="mt-2 text-sm">
              {results.results
                .filter((r) => !r.success)
                .map((r, i) => (
                  <li key={i} className="text-red-600">
                    {r.email}: {r.error}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <button onClick={onClear} className="text-gray-400 hover:text-gray-600">
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

function ImageUploader({
  headerImageUrl,
  onUrlChange,
  onClear,
  imageError,
  setImageError,
}: {
  headerImageUrl: string
  onUrlChange: (url: string) => void
  onClear: () => void
  imageError: boolean
  setImageError: (error: boolean) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('File must be an image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', {method: 'POST', body: formData})
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to upload image')

      onUrlChange(data.url)
      setImageError(false)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFileUpload(file)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <div className="space-y-1">
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          ) : (
            <>
              <ImageIcon />
              <p className="text-sm text-gray-600">
                Drop an image here or <span className="text-blue-600">browse</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400">or enter URL</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* URL input */}
      <input
        type="url"
        value={headerImageUrl}
        onChange={(e) => {
          onUrlChange(e.target.value)
          setImageError(false)
          setUploadError(null)
        }}
        placeholder="https://example.com/image.jpg"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
      />

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

      {/* Preview */}
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
            onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
          >
            <CloseIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      {imageError && (
        <p className="text-xs text-red-500">Failed to load image. Please check the URL.</p>
      )}
    </div>
  )
}

// ============================================================================
// Icons
// ============================================================================

function ComposeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function PreviewIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}

function CloseIcon({className = 'h-5 w-5'}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

// ============================================================================
// Main Component
// ============================================================================

// Available predefined recipient options
const PREDEFINED_RECIPIENTS: {value: PredefinedRecipient; label: string; description?: string}[] = [
  {value: 'registrants', label: 'Registrants', description: 'Selected registrants from the list'},
  {value: 'executive_assistants', label: 'Executive Assistants', description: 'Assistants of selected registrants'},
  {value: 'guests', label: 'Guests', description: 'Guests of selected registrants'},
  {value: 'info_email', label: 'info@nexus-retreat.com', description: 'Nexus Retreat info email'},
]

export default function EmailComposer({
  subject,
  setSubject,
  body,
  setBody,
  headerImageUrl,
  setHeaderImageUrl,
  recipientFields,
  setRecipientFields,
  selectedCount,
  isSending,
  onSend,
  sendResults,
  onClearResults,
  previewRegistration,
}: EmailComposerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [showHeaderImage, setShowHeaderImage] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('compose')

  // Check if at least one TO recipient is present
  const hasToRecipients = recipientFields.to.length > 0
  const canSend = hasToRecipients && !!subject.trim() && !!body.trim() && !isSending

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

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    if (!templateId) return

    const template = templates.find((t) => t._id === templateId)
    if (template) {
      setSubject(template.subject)
      const parts = [template.greeting, template.bodyIntroText, template.bodyOutroText, template.signature]
        .filter(Boolean)
        .map((text) => `<p>${text}</p>`)
      setBody(parts.join(''))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <TabButton
            active={activeTab === 'compose'}
            onClick={() => setActiveTab('compose')}
            icon={<ComposeIcon />}
            label="Compose"
          />
          <TabButton
            active={activeTab === 'preview'}
            onClick={() => setActiveTab('preview')}
            icon={<PreviewIcon />}
            label="Preview"
          />
        </div>
      </div>

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="p-4">
          <PreviewInfoBanner registration={previewRegistration} />
          <EmailPreview
            subject={subject}
            body={body}
            headerImageUrl={headerImageUrl}
            registration={previewRegistration}
          />
          <div className="pt-4 mt-4 border-t border-gray-200">
            <SendButton canSend={canSend} isSending={isSending} selectedCount={selectedCount} onClick={onSend} />
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="p-4 space-y-4">
          {sendResults && <SendResultsBanner results={sendResults} onClear={onClearResults} />}

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
              <ImageUploader
                headerImageUrl={headerImageUrl}
                onUrlChange={setHeaderImageUrl}
                onClear={() => setHeaderImageUrl('')}
                imageError={imageError}
                setImageError={setImageError}
              />
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
              Type <code className="bg-gray-100 px-1 rounded">@</code> to see all available variables,
              or click the <code className="bg-gray-100 px-1 rounded">{'{{}}'}</code> button in the
              toolbar
            </p>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <EmailRecipientField
              label="To"
              recipients={recipientFields.to}
              onChange={(to) => setRecipientFields({...recipientFields, to})}
              placeholder="Add recipients..."
              availablePredefined={PREDEFINED_RECIPIENTS}
            />
            <EmailRecipientField
              label="CC"
              recipients={recipientFields.cc}
              onChange={(cc) => setRecipientFields({...recipientFields, cc})}
              placeholder="Add CC recipients..."
              availablePredefined={PREDEFINED_RECIPIENTS}
            />
            <EmailRecipientField
              label="BCC"
              recipients={recipientFields.bcc}
              onChange={(bcc) => setRecipientFields({...recipientFields, bcc})}
              placeholder="Add BCC recipients..."
              availablePredefined={PREDEFINED_RECIPIENTS}
            />
          </div>

          {/* Send Button */}
          <div className="pt-4">
            <SendButton canSend={canSend} isSending={isSending} selectedCount={selectedCount} onClick={onSend} />
          </div>
        </div>
      )}
    </div>
  )
}
