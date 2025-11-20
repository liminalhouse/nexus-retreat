'use client'

import FormFieldRenderer from './FormFieldRenderer'
import type {FormStep} from './types'

interface FormStepRendererProps {
  step: FormStep
  formData: Record<string, any>
  onFieldChange: (name: string, value: any) => void
  onFieldBlur: (name: string) => void
  fieldErrors?: Record<string, string>
}

export default function FormStepRenderer({
  step,
  formData,
  onFieldChange,
  onFieldBlur,
  fieldErrors = {},
}: FormStepRendererProps) {
  const fieldGroups = step?.fieldGroups || []

  const shouldShowGroup = (group: any) => {
    // Don't show if explicitly hidden
    if (group?.hidden) return false

    if (!group?.showIfFieldHasValue) return true

    const fieldsToCheck = Array.isArray(group.showIfFieldHasValue)
      ? group.showIfFieldHasValue
      : [group.showIfFieldHasValue]

    return fieldsToCheck.some((fieldName: string) => {
      const value = formData[fieldName]
      return value !== undefined && value !== null && value !== ''
    })
  }

  return (
    <div className="space-y-8">
      {/* Field Groups */}
      {fieldGroups.map((group, groupIndex) => {
        if (!shouldShowGroup(group)) {
          return null
        }

        return (
          <div key={groupIndex} className="space-y-4">
            {/* Group Title */}
            {group?.groupTitle && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900">{group.groupTitle}</h3>
                {group?.groupDescription && (
                  <p className="text-sm text-gray-600 mt-1">{group.groupDescription}</p>
                )}
              </div>
            )}

            {/* Fields */}
            <div className="space-y-6">
              {group?.fields
                ?.filter((field) => !field?.hidden) // Filter out hidden fields
                .map((field, fieldIndex) => {
                  const fieldName = field?.name || ''
                  const hasError = !!fieldErrors[fieldName]

                  return (
                    <div key={fieldIndex}>
                      <FormFieldRenderer
                        field={field}
                        value={formData[fieldName]}
                        onChange={(value) => onFieldChange(fieldName, value)}
                        onBlur={() => onFieldBlur(fieldName)}
                        error={fieldErrors[fieldName]}
                      />
                      {hasError && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors[fieldName]}</p>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
