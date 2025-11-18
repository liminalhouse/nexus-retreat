'use client'

import FormFieldRenderer from './FormFieldRenderer'
import type {FormStep} from './types'

interface FormStepRendererProps {
  step: FormStep
  formData: Record<string, any>
  onFieldChange: (name: string, value: any) => void
}

export default function FormStepRenderer({step, formData, onFieldChange}: FormStepRendererProps) {
  const fieldGroups = step?.fieldGroups || []

  return (
    <div className="space-y-8">
      {/* Field Groups */}
      {fieldGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {/* Group Title */}
          {group?.groupTitle && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{group.groupTitle}</h3>
              {group?.groupDescription && (
                <p className="text-sm text-gray-600 mt-1">{group.groupDescription}</p>
              )}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-6">
            {group?.fields?.map((field, fieldIndex) => (
              <div key={fieldIndex}>
                <FormFieldRenderer
                  field={field}
                  value={formData[field?.name || '']}
                  onChange={(value) => onFieldChange(field?.name || '', value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
