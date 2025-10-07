import { SWOOGO_CONSTANTS } from '@/utils/swoogo'

export interface FormField {
    formDataKey?: string // The key used in FormData object
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
    id?: string
    name?: string
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
}

export interface FormStage {
    title: string
    description: string
    fields: FormField[]
}

export const rawFormConfig: FormStage[] = [
    // Stage 1: Personal & Contact Information
    {
        title: 'Personal Details',
        description:
            'Please provide your basic information and contact details.',
        fields: [
            {
                formDataKey: SWOOGO_CONSTANTS.email,
                type: 'email',
                label: 'Email Address',
                required: true,
                autoComplete: 'email',
                hintText:
                    'This should be the email you received your invitation from.',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.prefix,
                type: 'text',
                label: 'Prefix (Mr., Mrs., etc.)',
                required: true,
                autoComplete: 'honorific-prefix',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.first_name,
                type: 'text',
                label: 'First Name',
                required: true,
                autoComplete: 'given-name',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.middle_name,
                type: 'text',
                label: 'Middle Name',
                autoComplete: 'additional-name',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.last_name,
                type: 'text',
                label: 'Last Name',
                required: true,
                autoComplete: 'family-name',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.name_for_credentials,
                type: 'text',
                label: 'Name for Credentials',
                required: true,
                hintText:
                    'Full name as you would like it to appear on credentials and onsite materials.',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.title,
                type: 'text',
                label: 'Title',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.organization,
                type: 'text',
                label: 'Organization',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.organization_for_credentials,
                type: 'text',
                label: 'Organization for Credentials',
                required: true,
                hintText:
                    'Organization name as you would like it to appear on credentials and onsite materials.',
            },
            {
                formDataKey: SWOOGO_CONSTANTS.office_phone,
                type: 'tel',
                label: 'Office Phone',
                required: true,
            },
            {
                formDataKey: SWOOGO_CONSTANTS.mobile_phone,
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
                        formDataKey: SWOOGO_CONSTANTS.work_address_line_1,
                        type: 'text',
                        label: 'Address Line 1',
                        placeholder: 'Address Line 1',
                        autoComplete: 'address-line1',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.work_address_line_2,
                        type: 'text',
                        label: 'Address Line 2',
                        placeholder: 'Address Line 2',
                        autoComplete: 'address-line2',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.work_address_city,
                        type: 'text',
                        label: 'City',
                        autoComplete: 'address-level2',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.work_address_state,
                        type: 'text',
                        label: 'State / Province / County',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.work_address_zip,
                        type: 'text',
                        label: 'Zip / Postal Code',
                        autoComplete: 'postal-code',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.work_address_country_code,
                        type: 'select',
                        label: 'Country',
                        autoComplete: 'country',
                        options: [], // Will be populated by CountrySelect component
                    },
                ],
            },
            {
                formDataKey: SWOOGO_CONSTANTS.profile_picture,
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
                        formDataKey: SWOOGO_CONSTANTS.emergency_contact_name,
                        type: 'text',
                        label: 'Emergency Contact Name',
                        required: true,
                        hintText:
                            'Please provide a contact in case of emergency while you are with us at the Retreat.',
                    },
                    {
                        formDataKey:
                            SWOOGO_CONSTANTS.emergency_contact_relation,
                        type: 'text',
                        label: 'Emergency Contact Relation',
                        required: true,
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.emergency_contact_email,
                        type: 'email',
                        label: 'Emergency Contact Email',
                        required: true,
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.emergency_contact_phone,
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
                        formDataKey: SWOOGO_CONSTANTS.point_of_contact_name,
                        type: 'text',
                        label: 'Name',
                        required: true,
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.point_of_contact_title,
                        type: 'text',
                        label: 'Title',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.point_of_contact_email,
                        type: 'email',
                        label: 'Email',
                        required: true,
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.point_of_contact_phone,
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
                        formDataKey:
                            SWOOGO_CONSTANTS.secondary_point_of_contact_name,
                        type: 'text',
                        label: 'Name',
                    },
                    {
                        formDataKey:
                            SWOOGO_CONSTANTS.secondary_point_of_contact_email,
                        type: 'email',
                        label: 'Email',
                    },
                    {
                        formDataKey:
                            SWOOGO_CONSTANTS.secondary_point_of_contact_phone,
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
                        formDataKey: SWOOGO_CONSTANTS.guest_name,
                        type: 'text',
                        label: 'Guest name',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.guest_relation,
                        type: 'text',
                        label: 'Relation to you',
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.guest_email,
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
                        formDataKey: SWOOGO_CONSTANTS.dietary_restrictions,
                        type: 'textarea',
                        label: 'Dietary Restrictions or Allergies',
                        placeholder: 'Dietary Restrictions or Allergies',
                        multiline: true,
                        minRows: 3,
                    },
                    {
                        formDataKey: SWOOGO_CONSTANTS.jacket_size,
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
                        formDataKey:
                            SWOOGO_CONSTANTS.complimentary_accommodations,
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
                        formDataKey: SWOOGO_CONSTANTS.dinner_attendance,
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
                        formDataKey: SWOOGO_CONSTANTS.activities,
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
