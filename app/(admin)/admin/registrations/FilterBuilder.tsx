'use client'

import {useState} from 'react'
import type {Registration} from '@/lib/types/registration'

export type FilterCondition = {
  id: string
  field: string
  operator: string
  value: string
}

type FilterFieldConfig = {
  key: string
  label: string
  operators: {value: string; label: string}[]
  valueType: 'select' | 'text' | 'date'
  options?: {value: string; label: string}[]
}

const filterFields: FilterFieldConfig[] = [
  {
    key: 'guest_name',
    label: 'Has Guest',
    operators: [
      {value: 'exists', label: 'Has Guest'},
      {value: 'not_exists', label: 'No Guest'},
    ],
    valueType: 'select',
    options: [],
  },
  {
    key: 'assistant_name',
    label: 'Has Assistant',
    operators: [
      {value: 'exists', label: 'Has Assistant'},
      {value: 'not_exists', label: 'No Assistant'},
    ],
    valueType: 'select',
    options: [],
  },
  {
    key: 'dietary_restrictions',
    label: 'Dietary Restrictions',
    operators: [
      {value: 'exists', label: 'Has Dietary Restrictions'},
      {value: 'not_exists', label: 'No Dietary Restrictions'},
      {value: 'contains', label: 'Contains'},
    ],
    valueType: 'text',
  },
  {
    key: 'accommodations',
    label: 'Accommodations',
    operators: [
      {value: 'array_contains', label: 'Includes'},
      {value: 'array_not_contains', label: 'Does Not Include'},
      {value: 'exists', label: 'Has Accommodations'},
      {value: 'not_exists', label: 'No Accommodations'},
    ],
    valueType: 'select',
    options: [
      {value: 'march_18', label: 'March 18'},
      {value: 'march_19', label: 'March 19'},
    ],
  },
  {
    key: 'dinner_attendance',
    label: 'Dinner Attendance',
    operators: [
      {value: 'array_contains', label: 'Includes'},
      {value: 'array_not_contains', label: 'Does Not Include'},
      {value: 'exists', label: 'Has Dinner Plans'},
      {value: 'not_exists', label: 'No Dinner Plans'},
    ],
    valueType: 'select',
    options: [
      {value: 'march_18', label: 'March 18'},
      {value: 'march_19', label: 'March 19'},
    ],
  },
  // Note: Not sure if we need this
  // {
  //   key: 'jacket_size',
  //   label: 'Jacket Size',
  //   operators: [
  //     {value: 'equals', label: 'Equals'},
  //     {value: 'not_equals', label: 'Not Equals'},
  //   ],
  //   valueType: 'select',
  //   options: [
  //     {value: 'XS', label: 'XS'},
  //     {value: 'S', label: 'S'},
  //     {value: 'M', label: 'M'},
  //     {value: 'L', label: 'L'},
  //     {value: 'XL', label: 'XL'},
  //     {value: 'XXL', label: 'XXL'},
  //   ],
  // },
  {
    key: 'organization',
    label: 'Organization',
    operators: [
      {value: 'contains', label: 'Contains'},
      {value: 'equals', label: 'Equals'},
    ],
    valueType: 'text',
  },
  {
    key: 'city',
    label: 'City',
    operators: [
      {value: 'contains', label: 'Contains'},
      {value: 'equals', label: 'Equals'},
    ],
    valueType: 'text',
  },
  {
    key: 'state',
    label: 'State',
    operators: [
      {value: 'contains', label: 'Contains'},
      {value: 'equals', label: 'Equals'},
    ],
    valueType: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    operators: [
      {value: 'contains', label: 'Contains'},
      {value: 'equals', label: 'Equals'},
    ],
    valueType: 'text',
  },
  {
    key: 'created_at',
    label: 'Registration Date',
    operators: [
      {value: 'after', label: 'After'},
      {value: 'before', label: 'Before'},
      {value: 'on', label: 'On'},
    ],
    valueType: 'date',
  },
]

export function evaluateFilter(registration: Registration, filter: FilterCondition): boolean {
  const value = registration[filter.field as keyof Registration]

  switch (filter.operator) {
    case 'exists':
      return !!value
    case 'not_exists':
      return !value
    case 'equals':
      return value === filter.value
    case 'not_equals':
      return value !== filter.value
    case 'contains':
      return String(value || '')
        .toLowerCase()
        .includes(filter.value.toLowerCase())
    case 'array_contains':
      return Array.isArray(value) && value.includes(filter.value)
    case 'array_not_contains':
      return !Array.isArray(value) || !value.includes(filter.value)
    case 'after':
      return new Date(value as string) > new Date(filter.value)
    case 'before':
      return new Date(value as string) < new Date(filter.value)
    case 'on': {
      const regDate = new Date(value as string).toDateString()
      const filterDate = new Date(filter.value).toDateString()
      return regDate === filterDate
    }
    default:
      return true
  }
}

type FilterBuilderProps = {
  filters: FilterCondition[]
  onChange: (filters: FilterCondition[]) => void
}

export default function FilterBuilder({filters, onChange}: FilterBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: '',
    }
    onChange([...filters, newFilter])
    setIsOpen(true)
  }

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    onChange(
      filters.map((filter) => {
        if (filter.id === id) {
          const updatedFilter = {...filter, ...updates}
          // If field changed, reset operator and value
          if (updates.field) {
            const fieldConfig = filterFields.find((f) => f.key === updates.field)
            if (fieldConfig) {
              updatedFilter.operator = fieldConfig.operators[0].value
              updatedFilter.value = ''
            }
          }
          return updatedFilter
        }
        return filter
      }),
    )
  }

  const removeFilter = (id: string) => {
    onChange(filters.filter((filter) => filter.id !== id))
  }

  const clearAllFilters = () => {
    onChange([])
    setIsOpen(false)
  }

  const getFieldConfig = (fieldKey: string) => {
    return filterFields.find((f) => f.key === fieldKey)
  }

  const needsValueInput = (operator: string) => {
    return !['exists', 'not_exists'].includes(operator)
  }

  const needsDropdown = (operator: string) => {
    return ['array_contains', 'array_not_contains'].includes(operator)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={addFilter}
          className="px-4 py-2 bg-nexus-coral text-white rounded-lg hover:bg-nexus-coral-light transition-colors font-medium"
        >
          + Add Filter
        </button>
        {filters.length > 0 && (
          <>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isOpen ? 'Hide' : 'Show'} Filters ({filters.length})
            </button>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>
          </>
        )}
      </div>

      {isOpen && filters.length > 0 && (
        <div className="space-y-1 p-2 bg-blue-50 rounded-lg border border-gray-100">
          {filters.map((filter) => {
            const fieldConfig = getFieldConfig(filter.field)
            return (
              <div key={filter.id} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                {/* Field Select */}
                <select
                  name={`filter-field-${filter.id}`}
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, {field: e.target.value})}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent bg-blue-100"
                >
                  <option value="">Select field...</option>
                  {filterFields.map((field) => (
                    <option key={field.key} value={field.key}>
                      {field.label}
                    </option>
                  ))}
                </select>

                {/* Operator Select */}
                {fieldConfig && (
                  <select
                    name={`filter-operator-${filter.id}`}
                    value={filter.operator}
                    onChange={(e) => updateFilter(filter.id, {operator: e.target.value})}
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
                  >
                    {fieldConfig.operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Value Input */}
                {fieldConfig && needsValueInput(filter.operator) && (
                  <>
                    {(fieldConfig.valueType === 'select' && fieldConfig.options) ||
                    needsDropdown(filter.operator) ? (
                      <select
                        name={`filter-value-${filter.id}`}
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, {value: e.target.value})}
                        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {fieldConfig.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : fieldConfig.valueType === 'date' ? (
                      <input
                        type="date"
                        name={`filter-value-${filter.id}`}
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, {value: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
                      />
                    ) : (
                      <input
                        type="text"
                        name={`filter-value-${filter.id}`}
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, {value: e.target.value})}
                        placeholder="Enter value..."
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexus-coral focus:border-transparent"
                      />
                    )}
                  </>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-auto px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
