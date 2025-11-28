import {registrationFormConfig} from '@/app/(main)/register/formConfig'
import type {FormConfig, FormField} from '@/app/components/Form/types'

// Extract all fields from form config
export function getAllFormFields(config: FormConfig): FormField[] {
  const fields: FormField[] = []
  const steps = [config.step1, config.step2, config.step3].filter(Boolean)

  steps.forEach((step) => {
    step?.fieldGroups?.forEach((group) => {
      group?.fields?.forEach((field) => {
        if (field) {
          fields.push(field)
        }
      })
    })
  })

  return fields
}

// Get field by name
export function getFieldByName(fieldName: string): FormField | undefined {
  const allFields = getAllFormFields(registrationFormConfig)
  return allFields.find((field) => field.name === fieldName)
}

// Get all field names
export function getAllFieldNames(): string[] {
  return getAllFormFields(registrationFormConfig)
    .map((field) => field.name)
    .filter((name): name is string => name !== undefined)
}

// Field metadata for CSV export and display
export type FieldMetadata = {
  name: string
  label: string
  type: string
  required: boolean
  group?: string
}

// Get organized field metadata
export function getFieldMetadata(): FieldMetadata[] {
  const metadata: FieldMetadata[] = []
  const config = registrationFormConfig
  const steps = [
    {step: config.step1, title: config.step1?.title},
    {step: config.step2, title: config.step2?.title},
    {step: config.step3, title: config.step3?.title},
  ].filter((s) => s.step)

  steps.forEach(({step, title}) => {
    step?.fieldGroups?.forEach((group) => {
      const groupTitle = group?.groupTitle || title
      group?.fields?.forEach((field) => {
        if (field && field.name && field.label) {
          metadata.push({
            name: field.name,
            label: field.label,
            type: field.fieldType,
            required: field.required || false,
            group: groupTitle,
          })
        }
      })
    })
  })

  return metadata
}

// CSV Export Headers - derived from form config
export function getCSVHeaders(): string[] {
  const metadata = getFieldMetadata()
  return ['Registration Date', ...metadata.map((m) => m.label)]
}

// Map snake_case DB fields to form field labels
export const FIELD_LABEL_MAP: Record<string, string> = getFieldMetadata().reduce(
  (acc, field) => {
    acc[field.name] = field.label
    return acc
  },
  {} as Record<string, string>
)

// Get label for a field name
export function getFieldLabel(fieldName: string): string {
  return FIELD_LABEL_MAP[fieldName] || fieldName
}
