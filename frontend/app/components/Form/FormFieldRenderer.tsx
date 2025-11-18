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

  // Base input classes
  const inputClasses =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-navy focus:ring-nexus-navy sm:text-sm'

  // Text Input
  if (fieldType === 'text' || fieldType === 'email' || fieldType === 'tel') {
    return (
      <div>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
          placeholder={placeholder || ''}
          required={required}
          className={inputClasses}
        />
        {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }

  // Textarea
  if (fieldType === 'textarea') {
    return (
      <div>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          required={required}
          rows={4}
          className={inputClasses}
        />
        {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }

  // Select Dropdown
  if (fieldType === 'select') {
    return (
      <div>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={inputClasses}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option, idx) => (
            <option key={idx} value={option?.value || ''}>
              {option?.label || option?.value}
            </option>
          ))}
        </select>
        {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
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
