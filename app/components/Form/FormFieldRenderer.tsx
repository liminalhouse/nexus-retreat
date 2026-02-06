'use client'

import React from 'react'
import type {FormField} from './types'
import Image from 'next/image'

interface FormFieldRendererProps {
  field: FormField | undefined
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  error?: string
}

export default function FormFieldRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FormFieldRendererProps) {
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  if (!field) return null

  const fieldType = field.fieldType
  const label = field.label
  const name = field.name
  const placeholder = field.placeholder
  const helperText = field.helperText
  const required = field.required
  const options = field.options || []

  // Base input classes with modern styling
  const inputClasses = error
    ? 'block w-full px-4 py-3 rounded-lg border-2 border-red-500 bg-white text-gray-900 transition-all duration-300 ease-out focus:border-red-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-red-100 hover:border-red-600'
    : 'block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 transition-all duration-300 ease-out focus:border-blue-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-100 hover:border-gray-400'

  const labelClasses = error
    ? 'block text-sm font-medium text-red-700 mb-1'
    : 'block text-sm font-medium text-gray-700 mb-1'

  // Text Input
  if (fieldType === 'text' || fieldType === 'email' || fieldType === 'tel') {
    return (
      <div>
        {label && (
          <label htmlFor={name} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={fieldType}
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          placeholder={placeholder || ''}
          required={required}
          className={inputClasses}
        />
        {helperText && <p className="mt-2 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }

  // Textarea
  if (fieldType === 'textarea') {
    const textareaClasses = error
      ? 'block w-full px-4 py-3 rounded-lg border-2 border-red-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-300 ease-out focus:border-red-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-red-100 hover:border-red-600 resize-none'
      : 'block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all duration-300 ease-out focus:border-blue-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-100 hover:border-gray-400 resize-none'

    return (
      <div>
        {label && (
          <label htmlFor={name} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder || ''}
          required={required}
          rows={4}
          className={textareaClasses}
        />
        {helperText && <p className="mt-2 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }

  // Select Dropdown
  if (fieldType === 'select') {
    const selectClasses = error
      ? 'block w-full px-4 py-3 rounded-lg border-2 border-red-500 bg-white text-gray-900 transition-all duration-300 ease-out focus:border-red-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-red-100 hover:border-red-600 appearance-none cursor-pointer'
      : 'block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 transition-all duration-300 ease-out focus:border-blue-600 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-100 hover:border-gray-400 appearance-none cursor-pointer'

    return (
      <div>
        {label && (
          <label htmlFor={name} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            required={required}
            className={selectClasses}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option, idx) => (
              <option key={idx} value={option?.value || ''}>
                {option?.label || option?.value}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <svg
              className="h-5 w-5 text-gray-400 transition-colors duration-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {helperText && <p className="mt-2 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }

  // Single Checkbox
  if (fieldType === 'checkbox') {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            required={required}
            className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
          />
        </div>
        {label && (
          <label htmlFor={name} className="ml-3 text-sm text-gray-700 cursor-pointer">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {helperText && <p className="ml-7 mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }

  // Checkbox Group
  if (fieldType === 'checkboxGroup') {
    const selectedValues = Array.isArray(value) ? value : []

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        onChange([...selectedValues, optionValue])
      } else {
        onChange(selectedValues.filter((v: string) => v !== optionValue))
      }
    }

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {helperText && <p className="text-xs text-gray-500 mb-3">{helperText}</p>}
        <div className="space-y-2">
          {options.map((option, idx) => {
            const optionValue = option?.value || ''
            const isChecked = selectedValues.includes(optionValue)
            const checkboxId = `${name}_${idx}`

            return (
              <div key={idx} className="flex items-start">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    id={checkboxId}
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(optionValue, e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
                  />
                </div>
                <label htmlFor={checkboxId} className="ml-3 cursor-pointer flex flex-col gap-1">
                  <span className="text-sm text-gray-700 font-semibold">{option?.label || option?.value}</span>
                  {option?.description && (
                    <span className="block text-xs font-medium text-gray-500 max-w-md">
                      {option.description}
                    </span>
                  )}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Radio Group
  if (fieldType === 'radio') {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {helperText && <p className="text-xs text-gray-500 mb-3">{helperText}</p>}
        <div className="space-y-2">
          {options.map((option, idx) => {
            const optionValue = option?.value || ''
            const radioId = `${name}_${idx}`

            return (
              <div key={idx} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    id={radioId}
                    name={name}
                    value={optionValue}
                    checked={value === optionValue}
                    onChange={(e) => onChange(e.target.value)}
                    required={required && idx === 0}
                    className="h-4 w-4 border-2 border-gray-300 text-blue-600 transition-all duration-300 ease-out focus:ring-2 focus:ring-blue-100 focus:border-blue-600 hover:border-gray-400 cursor-pointer"
                  />
                </div>
                <label htmlFor={radioId} className="ml-3 text-sm text-gray-700 cursor-pointer">
                  {option?.label || option?.value}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // File Input
  if (fieldType === 'file') {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      setUploadError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        onChange(data.url)
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError(error instanceof Error ? error.message : 'Failed to upload image')
      } finally {
        setUploading(false)
      }
    }

    return (
      <div>
        {label && (
          <label htmlFor={name} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {helperText && <p className="text-xs text-gray-500 mb-2 cursor-pointer ">{helperText}</p>}
        <div className="flex items-center gap-4">
          <input
            type="file"
            id={name}
            name={name}
            onChange={handleFileChange}
            onBlur={onBlur}
            accept={field.accept || 'image/*'}
            required={required}
            disabled={uploading}
            className="block w-full text-sm text-gray-900 border border-2 border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:border-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
          {value && !uploading && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <Image
                src={value}
                alt="Preview"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </div>
    )
  }

  return null
}
