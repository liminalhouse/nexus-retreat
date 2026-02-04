'use client'

import {useState, useRef, useEffect} from 'react'
import {XMarkIcon, ChevronDownIcon} from '@heroicons/react/20/solid'

// Predefined recipient types that map to registration data
export type PredefinedRecipient = 'registrants' | 'executive_assistants' | 'guests' | 'info_email'

export type EmailRecipient =
  | {type: 'predefined'; value: PredefinedRecipient; label: string}
  | {type: 'custom'; value: string}

type EmailRecipientFieldProps = {
  label: string
  recipients: EmailRecipient[]
  onChange: (recipients: EmailRecipient[]) => void
  placeholder?: string
  availablePredefined: {value: PredefinedRecipient; label: string; description?: string}[]
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function EmailRecipientField({
  label,
  recipients,
  onChange,
  placeholder = 'Add recipients...',
  availablePredefined,
}: EmailRecipientFieldProps) {
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter out already selected predefined recipients
  const selectedPredefinedValues = recipients
    .filter((r): r is EmailRecipient & {type: 'predefined'} => r.type === 'predefined')
    .map((r) => r.value)

  const availableOptions = availablePredefined.filter(
    (opt) => !selectedPredefinedValues.includes(opt.value)
  )

  // Filter options based on input
  const filteredOptions = inputValue.trim()
    ? availableOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          opt.value.toLowerCase().includes(inputValue.toLowerCase())
      )
    : availableOptions

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions.length])

  const addRecipient = (recipient: EmailRecipient) => {
    // Check for duplicates
    const isDuplicate = recipients.some((r) => {
      if (r.type === 'predefined' && recipient.type === 'predefined') {
        return r.value === recipient.value
      }
      if (r.type === 'custom' && recipient.type === 'custom') {
        return r.value.toLowerCase() === recipient.value.toLowerCase()
      }
      return false
    })

    if (!isDuplicate) {
      onChange([...recipients, recipient])
    }
    setInputValue('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const removeRecipient = (index: number) => {
    onChange(recipients.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowDropdown(true)
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (showDropdown && filteredOptions.length > 0 && highlightedIndex < filteredOptions.length) {
        // Select highlighted predefined option
        const option = filteredOptions[highlightedIndex]
        addRecipient({type: 'predefined', value: option.value, label: option.label})
      } else if (inputValue.trim()) {
        // Try to add as custom email
        const email = inputValue.trim()
        if (isValidEmail(email)) {
          addRecipient({type: 'custom', value: email})
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && recipients.length > 0) {
      // Remove last recipient
      removeRecipient(recipients.length - 1)
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    } else if (e.key === ',' || e.key === 'Tab') {
      if (inputValue.trim()) {
        e.preventDefault()
        const email = inputValue.trim()
        if (isValidEmail(email)) {
          addRecipient({type: 'custom', value: email})
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowDropdown(true)
  }

  const getRecipientLabel = (recipient: EmailRecipient): string => {
    if (recipient.type === 'predefined') {
      return recipient.label
    }
    return recipient.value
  }

  const getRecipientColor = (recipient: EmailRecipient): string => {
    if (recipient.type === 'predefined') {
      switch (recipient.value) {
        case 'registrants':
          return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'executive_assistants':
          return 'bg-purple-100 text-purple-800 border-purple-200'
        case 'guests':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'info_email':
          return 'bg-amber-100 text-amber-800 border-amber-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className="min-h-[42px] px-2 py-1.5 border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 flex flex-wrap items-center gap-1.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Recipient Tags */}
        {recipients.map((recipient, index) => (
          <span
            key={`${recipient.type}-${recipient.type === 'predefined' ? recipient.value : recipient.value}-${index}`}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRecipientColor(recipient)}`}
          >
            {getRecipientLabel(recipient)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeRecipient(index)
              }}
              className="hover:bg-black/10 rounded-full p-0.5"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <div className="flex-1 min-w-[150px] flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder={recipients.length === 0 ? placeholder : ''}
            className="flex-1 outline-none text-sm min-w-0 bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (filteredOptions.length > 0 || inputValue.trim()) && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Predefined options */}
          {filteredOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => addRecipient({type: 'predefined', value: option.value, label: option.label})}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                index === highlightedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <div className="text-sm font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-xs text-gray-500">{option.description}</div>
              )}
            </button>
          ))}

          {/* Custom email option */}
          {inputValue.trim() && isValidEmail(inputValue.trim()) && (
            <button
              type="button"
              onClick={() => addRecipient({type: 'custom', value: inputValue.trim()})}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 border-t border-gray-100"
            >
              <div className="text-sm text-gray-700">
                Add &quot;{inputValue.trim()}&quot;
              </div>
            </button>
          )}

          {/* Invalid email hint */}
          {inputValue.trim() && !isValidEmail(inputValue.trim()) && filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Enter a valid email address
            </div>
          )}
        </div>
      )}

      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-500">
        Select from the dropdown or type an email address
      </p>
    </div>
  )
}
