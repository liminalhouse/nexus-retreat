import { FormField, FormStage, rawFormConfig } from './rawFormConfig'

// Helper function to extract form data key from field name
// function getFormDataKey(fieldName: string): string {
//     // Handle nested address structure: Address[Registrant][work_address_id][field]
//     if (fieldName.includes('Address[Registrant][work_address_id]')) {
//         const match = fieldName.match(
//             /Address\[Registrant\]\[work_address_id\]\[([^\]]+)\]/
//         )
//         return match ? `work_address_id.${match[1]}` : fieldName
//     }

//     // Handle regular Registrant fields: Registrant[field]
//     const match = fieldName.match(/\[([^\]]+)\]$/)
//     return match ? match[1] : fieldName
// }

// Helper function to get validation type from field type and name
function getValidationType(field: {
    type: string
    name: string
}): 'email' | 'phone' | 'text' | undefined {
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

export function getRequiredFields(): FormField[] {
    return getAllFormFields().filter((field) => field.required)
}

export function getFieldByFormDataKey(key: string): FormField | undefined {
    return getAllFormFields().find((field) => field.formDataKey === key)
}

// export function getFieldByName(name: string): FormField | undefined {
//     return getAllFormFields().find((field) => field.name === name)
// }

export function getPhoneFields(): FormField[] {
    return getAllFormFields().filter(
        (field) => field.validationType === 'phone'
    )
}

export function getEmailFields(): FormField[] {
    return getAllFormFields().filter(
        (field) => field.validationType === 'email'
    )
}
