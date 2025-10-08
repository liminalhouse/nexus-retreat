import { FormField, FormStage, rawFormConfig } from './rawFormConfig'

// Helper function to get validation type from field type
function getValidationType(
    field: FormField
): 'email' | 'phone' | 'text' | undefined {
    if (field.type === 'email') return 'email'
    if (field.type === 'tel') return 'phone'
    return 'text'
}

// Helper function to add metadata to form fields
function enhanceFormField(field: FormField): FormField {
    const enhanced = {
        ...field,
        validationType: getValidationType(field),
    }

    // Recursively enhance nested fields
    if (field.fields) {
        enhanced.fields = field.fields.map(enhanceFormField)
    }

    return enhanced
}

// Enhanced form config with metadata
export const formConfig: FormStage[] = rawFormConfig.map((stage) => ({
    ...stage,
    fields: stage.fields.map(enhanceFormField),
}))

// Utility functions to get field information from the enhanced config
export function getAllFormFields(): FormField[] {
    const allFields: FormField[] = []

    function extractFields(fields: FormField[]) {
        fields.forEach((field) => {
            allFields.push(field)
            if (field.fields) {
                extractFields(field.fields)
            }
        })
    }

    formConfig.forEach((stage) => extractFields(stage.fields))
    return allFields
}

export function getFieldByFormDataKey(key: string): FormField | undefined {
    return getAllFormFields().find((field) => field.formDataKey === key)
}
