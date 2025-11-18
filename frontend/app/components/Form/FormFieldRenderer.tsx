'use client'

import type {FormField} from './types'

interface FormFieldRendererProps {
  field: FormField | undefined
  value: any
  onChange: (value: any) => void
}

export default function FormFieldRenderer({field, value, onChange}: FormFieldRendererProps) {
  if (!field) return null

  const fieldType = field.fieldType
  const label = field.label
  const name = field.name
  const placeholder = field.placeholder
  const helperText = field.helperText
  const required = field.required
  const options = field.options || []

  // Base input classes with modern styling
  const inputClasses =
    'peer block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-transparent transition-all duration-200 focus:border-blue-600 focus:ring-0 focus:outline-none'

  const labelClasses =
    'absolute left-3 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-600'

  // Text Input
  if (fieldType === 'text' || fieldType === 'email' || fieldType === 'tel') {
    return (
      <div>
        <div className="relative">
          <input
            type={fieldType}
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label || placeholder || ''}
            required={required}
            className={inputClasses}
          />
          {label && (
            <label htmlFor={name} className={labelClasses}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {helperText && <p className="mt-2 text-xs text-gray-500 pl-4">{helperText}</p>}
      </div>
    )
  }

  // Textarea
  if (fieldType === 'textarea') {
    const textareaClasses =
      'peer block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-transparent transition-all duration-200 focus:border-blue-600 focus:ring-0 focus:outline-none resize-none'

    return (
      <div>
        <div className="relative">
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label || placeholder || ''}
            required={required}
            rows={4}
            className={textareaClasses}
          />
          {label && (
            <label htmlFor={name} className={labelClasses}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {helperText && <p className="mt-2 text-xs text-gray-500 pl-4">{helperText}</p>}
      </div>
    )
  }

  // Select Dropdown
  if (fieldType === 'select') {
    const selectClasses =
      'peer block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 transition-all duration-200 focus:border-blue-600 focus:ring-0 focus:outline-none appearance-none cursor-pointer'

    const selectLabelClasses =
      'absolute left-3 -top-2.5 bg-white px-2 text-xs font-medium transition-all duration-200 ' +
      (value ? 'text-blue-600' : 'text-gray-600')

    return (
      <div>
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
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
              className="h-5 w-5 text-gray-400"
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
          {label && (
            <label htmlFor={name} className={selectLabelClasses}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {helperText && <p className="mt-2 text-xs text-gray-500 pl-4">{helperText}</p>}
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
            className="h-4 w-4 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
          />
        </div>
        {label && (
          <label htmlFor={name} className="ml-3 text-sm text-gray-700">
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
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id={checkboxId}
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(optionValue, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                  />
                </div>
                <label htmlFor={checkboxId} className="ml-3 text-sm text-gray-700">
                  {option?.label || option?.value}
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
                    className="h-4 w-4 border-gray-300 text-nexus-navy focus:ring-nexus-navy"
                  />
                </div>
                <label htmlFor={radioId} className="ml-3 text-sm text-gray-700">
                  {option?.label || option?.value}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
