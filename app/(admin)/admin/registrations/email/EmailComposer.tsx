'use client'

import {useState, useEffect, useMemo} from 'react'
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

type Tab = 'compose' | 'preview'

// Nexus brand colors matching the email template
const NEXUS_COLORS = {
  navy: '#3d4663',
  navyDark: '#1c2544',
  coral: '#f49898',
  coralLight: '#f5a8a8',
  beige: '#faf5f1',
  seafoam: '#bed1bf',
  white: '#ffffff',
  gray: {
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
  },
}

function EmailPreview({body, headerImageUrl, subject}: {body: string; headerImageUrl?: string; subject: string}) {
  // Style the body content with proper typography (matching server-side)
  const styledBody = useMemo(() => {
    return body
      .replace(/<p>/g, `<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: ${NEXUS_COLORS.gray[600]}; margin: 0 0 16px 0; line-height: 1.7;">`)
      .replace(/<h1>/g, `<h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 0 0 20px 0; line-height: 1.3;">`)
      .replace(/<h2>/g, `<h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 24px 0 16px 0; line-height: 1.3;">`)
      .replace(/<h3>/g, `<h3 style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 600; color: ${NEXUS_COLORS.navy}; margin: 20px 0 12px 0; line-height: 1.3;">`)
      .replace(/<strong>/g, `<strong style="color: ${NEXUS_COLORS.navy}; font-weight: 600;">`)
      .replace(/<a /g, `<a style="color: ${NEXUS_COLORS.coral}; text-decoration: underline;" `)
      .replace(/<ul>/g, `<ul style="margin: 0 0 16px 0; padding-left: 24px; color: ${NEXUS_COLORS.gray[600]};">`)
      .replace(/<ol>/g, `<ol style="margin: 0 0 16px 0; padding-left: 24px; color: ${NEXUS_COLORS.gray[600]};">`)
      .replace(/<li>/g, `<li style="margin-bottom: 8px; line-height: 1.6;">`)
      .replace(/<blockquote>/g, `<blockquote style="margin: 16px 0; padding: 16px 20px; background: ${NEXUS_COLORS.beige}; border-left: 4px solid ${NEXUS_COLORS.coral}; border-radius: 0 8px 8px 0;">`)
  }, [body])

  return (
    <div className="bg-[#faf5f1] p-6 rounded-lg min-h-[500px]">
      {/* Email container */}
      <div className="max-w-[600px] mx-auto">
        {/* Logo */}
        <div className="text-center pb-6">
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: '28px',
              fontWeight: 600,
              color: NEXUS_COLORS.navy,
              letterSpacing: '-0.5px',
            }}
          >
            Nexus Retreat
          </span>
        </div>

        {/* Main card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: NEXUS_COLORS.white,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Header image */}
          {headerImageUrl && (
            <img src={headerImageUrl} alt="Email header" className="w-full h-auto" />
          )}

          {/* Subject preview */}
          <div className="px-10 pt-8 pb-2">
            <p
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: '12px',
                color: NEXUS_COLORS.gray[400],
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: 0,
              }}
            >
              Subject
            </p>
            <p
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: '20px',
                fontWeight: 600,
                color: NEXUS_COLORS.navy,
                margin: '4px 0 0 0',
              }}
            >
              {subject || 'No subject'}
            </p>
          </div>

          <div
            className="h-px mx-10 my-4"
            style={{backgroundColor: NEXUS_COLORS.seafoam}}
          />

          {/* Body content */}
          <div className="px-10 pb-8">
            {body ? (
              <div dangerouslySetInnerHTML={{__html: styledBody}} />
            ) : (
              <p
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: '15px',
                  color: NEXUS_COLORS.gray[400],
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
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '13px',
              color: NEXUS_COLORS.gray[400],
              margin: '0 0 8px 0',
            }}
          >
            Nexus Retreat · Boca Raton, Florida
          </p>
          <p
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '12px',
              color: NEXUS_COLORS.gray[400],
              margin: 0,
            }}
          >
            Questions? Contact us at{' '}
            <span style={{color: NEXUS_COLORS.coral}}>info@nexus-retreat.com</span>
          </p>
        </div>
      </div>
    </div>
  )
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
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('compose')

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
    setUploadError(null)
  }

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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setHeaderImageUrl(data.url)
      setImageError(false)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const canSend = selectedCount > 0 && subject.trim() && body.trim() && !isSending

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'compose'
                ? 'text-nexus-navy'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Compose
            </span>
            {activeTab === 'compose' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-coral" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'preview'
                ? 'text-nexus-navy'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </span>
            {activeTab === 'preview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-coral" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="p-4">
          <EmailPreview body={body} headerImageUrl={headerImageUrl} subject={subject} />

          {/* Send Button in Preview */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onSend}
              disabled={!canSend}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                canSend ? 'bg-nexus-coral hover:bg-nexus-coral-light text-nexus-navy-dark' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                `Send to ${selectedCount} Recipient${selectedCount !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
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
            <div className="space-y-3">
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="space-y-1">
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
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
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-600">
                        Drop an image here or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Or divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400">or enter URL</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* URL Input */}
              <input
                type="url"
                value={headerImageUrl}
                onChange={(e) => handleHeaderImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Upload Error */}
              {uploadError && (
                <p className="text-xs text-red-500">{uploadError}</p>
              )}

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
            className={`w-full py-3 px-4 rounded-md font-medium ${
              canSend ? 'bg-nexus-coral hover:bg-nexus-coral-light text-nexus-navy-dark' : 'bg-gray-300 text-white cursor-not-allowed'
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
      )}
    </div>
  )
}
