export interface FormField {
    id: string
    name: string
    type:
        | 'text'
        | 'email'
        | 'tel'
        | 'select'
        | 'checkbox-group'
        | 'textarea'
        | 'file'
        | 'fieldset'
        | 'group'
    label: string
    required?: boolean
    placeholder?: string
    autoComplete?: string
    ariaDescribedBy?: string
    options?: Array<{
        value: string
        label: string
        ariaLabel?: string
    }>
    fields?: FormField[] // For fieldset type
    hintText?: string
    multiline?: boolean
    minRows?: number
    accept?: string
    defaultValue?: string | string[]
    // Validation metadata
    validationType?: 'email' | 'phone' | 'text'
    formDataKey?: string // The key used in FormData object
}

export interface FormStage {
    title: string
    description: string
    fields: FormField[]
}

// Helper function to extract form data key from field name
function getFormDataKey(fieldName: string): string {
    // Handle nested address structure: Address[Registrant][work_address_id][field]
    if (fieldName.includes('Address[Registrant][work_address_id]')) {
        const match = fieldName.match(
            /Address\[Registrant\]\[work_address_id\]\[([^\]]+)\]/
        )
        return match ? `work_address_id.${match[1]}` : fieldName
    }

    // Handle regular Registrant fields: Registrant[field]
    const match = fieldName.match(/\[([^\]]+)\]$/)
    return match ? match[1] : fieldName
}

// Helper function to get validation type from field type and name
function getValidationType(field: {
    type: string
    name: string
}): 'email' | 'phone' | 'text' | undefined {
    if (field.type === 'email') return 'email'
    if (field.type === 'tel') return 'phone'
    if (field.name.includes('email')) return 'email'
    if (field.name.includes('phone')) return 'phone'
    return 'text'
}

// Helper function to add metadata to form fields
function enhanceFormField(field: FormField): FormField {
    const enhanced = {
        ...field,
        formDataKey: getFormDataKey(field.name),
        validationType: getValidationType(field),
    }

    // Recursively enhance nested fields
    if (field.fields) {
        enhanced.fields = field.fields.map(enhanceFormField)
    }

    return enhanced
}

const rawFormConfig: FormStage[] = [
    // Stage 1: Personal & Contact Information
    {
        title: 'Personal Details',
        description:
            'Please provide your basic information and contact details.',
        fields: [
            {
                id: 'registrant-email',
                name: 'Registrant[email]',
                type: 'email',
                label: 'Email Address',
                required: true,
                autoComplete: 'email',
                hintText:
                    'This should be the email you received your invitation from.',
            },
            {
                id: 'registrant-prefix',
                name: 'Registrant[prefix]',
                type: 'text',
                label: 'Prefix (Mr., Mrs., etc.)',
                required: true,
                autoComplete: 'honorific-prefix',
            },
            {
                id: 'registrant-first_name',
                name: 'Registrant[first_name]',
                type: 'text',
                label: 'First Name',
                required: true,
                autoComplete: 'given-name',
            },
            {
                id: 'registrant-middle_name',
                name: 'Registrant[middle_name]',
                type: 'text',
                label: 'Middle Name',
                autoComplete: 'additional-name',
            },
            {
                id: 'registrant-last_name',
                name: 'Registrant[last_name]',
                type: 'text',
                label: 'Last Name',
                required: true,
                autoComplete: 'family-name',
            },
            {
                id: 'registrant-c_6716240',
                name: 'Registrant[c_6716240]',
                type: 'text',
                label: 'Name for Credentials',
                required: true,
                hintText:
                    'Full name as you would like it to appear on credentials and onsite materials.',
            },
            {
                id: 'registrant-c_6716230',
                name: 'Registrant[c_6716230]',
                type: 'text',
                label: 'Title',
            },
            {
                id: 'registrant-c_6716228',
                name: 'Registrant[c_6716228]',
                type: 'text',
                label: 'Organization',
            },
            {
                id: 'registrant-c_6716241',
                name: 'Registrant[c_6716241]',
                type: 'text',
                label: 'Organization for Credentials',
                required: true,
                hintText:
                    'Organization name as you would like it to appear on credentials and onsite materials.',
            },
            {
                id: 'registrant-c_6716229',
                name: 'Registrant[c_6716229]',
                type: 'tel',
                label: 'Office Phone',
                required: true,
            },
            {
                id: 'registrant-mobile_phone',
                name: 'Registrant[mobile_phone]',
                type: 'tel',
                label: 'Mobile Phone',
            },
            {
                id: 'work-address-fieldset',
                name: 'work_address_fieldset',
                type: 'fieldset',
                label: 'Work Address',
                fields: [
                    {
                        id: 'address-registrant-work_address_id-line_1',
                        name: 'Address[Registrant][work_address_id][line_1]',
                        type: 'text',
                        label: 'Address Line 1',
                        placeholder: 'Address Line 1',
                        autoComplete: 'address-line1',
                    },
                    {
                        id: 'address-registrant-work_address_id-line_2',
                        name: 'Address[Registrant][work_address_id][line_2]',
                        type: 'text',
                        label: 'Address Line 2',
                        placeholder: 'Address Line 2',
                        autoComplete: 'address-line2',
                    },
                    {
                        id: 'address-registrant-work_address_id-city',
                        name: 'Address[Registrant][work_address_id][city]',
                        type: 'text',
                        label: 'City',
                        autoComplete: 'address-level2',
                    },
                    {
                        id: 'address-registrant-work_address_id-state',
                        name: 'Address[Registrant][work_address_id][state]',
                        type: 'text',
                        label: 'State / Province / County',
                    },
                    {
                        id: 'address-registrant-work_address_id-zip',
                        name: 'Address[Registrant][work_address_id][zip]',
                        type: 'text',
                        label: 'Zip / Postal Code',
                        autoComplete: 'postal-code',
                    },
                    {
                        id: 'country-select',
                        name: 'Address[Registrant][work_address_id][country_code]',
                        type: 'select',
                        label: 'Country',
                        autoComplete: 'country',
                        options: [], // Will be populated by CountrySelect component
                    },
                ],
            },
            {
                id: 'registrant-profile_picture',
                name: 'Registrant[profile_picture]',
                type: 'file',
                label: 'Upload a Profile Picture',
                accept: 'image/*',
            },
        ],
    },
    // Stage 2: Additional Details
    {
        title: 'Emergency & Contact Information',
        description:
            'Please provide additional information for your registration.',
        fields: [
            {
                id: 'emergency-contact-group',
                name: 'emergency_contact_group',
                type: 'group',
                label: 'Emergency Contact',
                fields: [
                    {
                        id: 'registrant-c_6716242',
                        name: 'Registrant[c_6716242]',
                        type: 'text',
                        label: 'Emergency Contact Name',
                        required: true,
                        hintText:
                            'Please provide a contact in case of emergency while you are with us at the Retreat.',
                    },
                    {
                        id: 'registrant-c_6716243',
                        name: 'Registrant[c_6716243]',
                        type: 'text',
                        label: 'Emergency Contact Relation',
                        required: true,
                    },
                    {
                        id: 'registrant-c_6716244',
                        name: 'Registrant[c_6716244]',
                        type: 'email',
                        label: 'Emergency Contact Email',
                        required: true,
                    },
                    {
                        id: 'registrant-c_6716246',
                        name: 'Registrant[c_6716246]',
                        type: 'tel',
                        label: 'Emergency Contact Phone',
                        required: true,
                    },
                ],
            },
            {
                id: 'point-of-contact-group',
                name: 'point_of_contact_group',
                type: 'group',
                label: 'Point of Contact',
                fields: [
                    {
                        id: 'registrant-c_6716225',
                        name: 'Registrant[c_6716225]',
                        type: 'text',
                        label: 'Name',
                        required: true,
                    },
                    {
                        id: 'registrant-c_6716226',
                        name: 'Registrant[c_6716226]',
                        type: 'text',
                        label: 'Title',
                    },
                    {
                        id: 'registrant-c_6716231',
                        name: 'Registrant[c_6716231]',
                        type: 'email',
                        label: 'Email',
                        required: true,
                    },
                    {
                        id: 'registrant-c_6716232',
                        name: 'Registrant[c_6716232]',
                        type: 'tel',
                        label: 'Phone',
                    },
                ],
            },
            {
                id: 'secondary-contact-group',
                name: 'secondary_contact_group',
                type: 'group',
                label: 'Secondary Point of Contact',
                fields: [
                    {
                        id: 'registrant-c_6716234',
                        name: 'Registrant[c_6716234]',
                        type: 'text',
                        label: 'Name',
                    },
                    {
                        id: 'registrant-c_6716236',
                        name: 'Registrant[c_6716236]',
                        type: 'email',
                        label: 'Email',
                    },
                    {
                        id: 'registrant-c_6716237',
                        name: 'Registrant[c_6716237]',
                        type: 'tel',
                        label: 'Phone',
                    },
                ],
            },
        ],
    },
    // Stage 3: Event Details & Contacts
    {
        title: 'Event Details',
        description:
            'Please provide contact information and event preferences.',
        fields: [
            {
                id: 'guest-information-group',
                name: 'guest_information_group',
                type: 'group',
                label: 'If you are bringing a partner or spouse, please provide their information below.',
                fields: [
                    {
                        id: 'registrant-c_6832581',
                        name: 'Registrant[c_6832581]',
                        type: 'text',
                        label: 'Guest name',
                    },
                    {
                        id: 'registrant-c_6716248',
                        name: 'Registrant[c_6716248]',
                        type: 'text',
                        label: 'Relation to you',
                    },
                    {
                        id: 'registrant-c_6716239',
                        name: 'Registrant[c_6716239]',
                        type: 'email',
                        label: 'Guest email',
                    },
                ],
            },
            {
                id: 'other-details',
                name: 'other_details',
                type: 'group',
                label: 'Other event details',
                fields: [
                    {
                        id: 'registrant-c_6716247',
                        name: 'Registrant[c_6716247]',
                        type: 'textarea',
                        label: 'Dietary Restrictions or Allergies',
                        placeholder: 'Dietary Restrictions or Allergies',
                        multiline: true,
                        minRows: 3,
                    },
                    {
                        id: 'registrant-c_6716271',
                        name: 'Registrant[c_6716271]',
                        type: 'select',
                        label: 'What is your jacket size?',
                        options: [
                            { value: '', label: 'Select...' },
                            { value: '38978942', label: 'X Small' },
                            { value: '38978939', label: 'Small' },
                            { value: '38978940', label: 'Medium' },
                            { value: '38978941', label: 'Large' },
                            { value: '38978943', label: 'X Large' },
                            { value: '38978944', label: 'XX Large' },
                        ],
                    },
                    {
                        id: 'registrant-c_6716267',
                        name: 'Registrant[c_6716267]',
                        type: 'checkbox-group',
                        label: 'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19. Please share which nights you will be staying with us.',
                        defaultValue: [],
                        options: [
                            {
                                value: '38978933',
                                label: 'I will use my complimentary room the night of March 18.',
                                ariaLabel:
                                    'I will use my complimentary room the night of March 18.',
                            },
                            {
                                value: '38978934',
                                label: 'I will use my complimentary room the night of March 19.',
                                ariaLabel:
                                    'I will use my complimentary room the night of March 19.',
                            },
                        ],
                    },
                    {
                        id: 'registrant-c_6716269',
                        name: 'Registrant[c_6716269]',
                        type: 'checkbox-group',
                        label: 'Which nights will you attend dinner?',
                        defaultValue: [],
                        options: [
                            {
                                value: '38978935',
                                label: 'I will attend the Dinner on March 18.',
                                ariaLabel:
                                    'I will attend the Dinner on March 18.',
                            },
                            {
                                value: '38978936',
                                label: 'I will attend the Dinner on March 19.',
                                ariaLabel:
                                    'I will attend the Dinner on March 19.',
                            },
                        ],
                    },
                    {
                        id: 'registrant-c_6838231',
                        name: 'Registrant[c_6838231]',
                        type: 'checkbox-group',
                        label: 'What activities are you interested in joining?',
                        defaultValue: [],
                        options: [
                            {
                                value: '39626531',
                                label: 'Pickleball tournament (upriver / downriver style) on March 19',
                                ariaLabel:
                                    'Pickleball tournament (upriver / downriver style) on March 19',
                            },
                            {
                                value: '39626575',
                                label: 'Golf - Full round',
                                ariaLabel: 'Golf - Full round',
                            },
                            {
                                value: '39626586',
                                label: 'Golf - 9 holes',
                                ariaLabel: 'Golf - 9 holes',
                            },
                            {
                                value: '39626588',
                                label: 'Golf challenge with a pro',
                                ariaLabel: 'Golf challenge with a pro',
                            },
                            {
                                value: '39626589',
                                label: 'Tennis',
                                ariaLabel: 'Tennis',
                            },
                            {
                                value: '39626590',
                                label: 'Tennis challenge with a pro',
                                ariaLabel: 'Tennis challenge with a pro',
                            },
                            {
                                value: '39626592',
                                label: 'Sailing excursion with a SailGP team member',
                                ariaLabel:
                                    'Sailing excursion with a SailGP team member',
                            },
                            {
                                value: '39626591',
                                label: "Please don't bother me, I'll be at the spa :)",
                                ariaLabel:
                                    "Please don't bother me, I'll be at the spa :)",
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

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

export function getFieldByName(name: string): FormField | undefined {
    return getAllFormFields().find((field) => field.name === name)
}

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
