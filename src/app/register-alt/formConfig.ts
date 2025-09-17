export interface FormField {
    id: string
    name: string
    type: 'text' | 'email' | 'tel' | 'select' | 'checkbox-group' | 'textarea' | 'file' | 'fieldset'
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
}

export interface FormStage {
    title: string
    description: string
    fields: FormField[]
}

export const formConfig: FormStage[] = [
    // Stage 1: Personal & Contact Information
    {
        title: 'Personal & Contact Information',
        description: 'Please provide your basic information and contact details.',
        fields: [
            {
                id: 'registrant-email',
                name: 'Registrant[email]',
                type: 'email',
                label: 'Email Address',
                required: true,
                autoComplete: 'email',
                ariaDescribedBy: 'error-registrant-email'
            },
            {
                id: 'registrant-prefix',
                name: 'Registrant[prefix]',
                type: 'text',
                label: 'Prefix (Mr., Mrs., etc.)',
                required: true,
                autoComplete: 'honorific-prefix',
                ariaDescribedBy: 'error-registrant-prefix'
            },
            {
                id: 'registrant-first_name',
                name: 'Registrant[first_name]',
                type: 'text',
                label: 'First Name',
                required: true,
                autoComplete: 'given-name',
                ariaDescribedBy: 'error-registrant-first_name'
            },
            {
                id: 'registrant-middle_name',
                name: 'Registrant[middle_name]',
                type: 'text',
                label: 'Middle Name',
                autoComplete: 'additional-name',
                ariaDescribedBy: 'error-registrant-middle_name'
            },
            {
                id: 'registrant-last_name',
                name: 'Registrant[last_name]',
                type: 'text',
                label: 'Last Name',
                required: true,
                autoComplete: 'family-name',
                ariaDescribedBy: 'error-registrant-last_name'
            },
            {
                id: 'registrant-c_6716230',
                name: 'Registrant[c_6716230]',
                type: 'text',
                label: 'Title',
                ariaDescribedBy: 'error-registrant-c_6716230'
            },
            {
                id: 'registrant-c_6716228',
                name: 'Registrant[c_6716228]',
                type: 'text',
                label: 'Organization',
                ariaDescribedBy: 'error-registrant-c_6716228'
            },
            {
                id: 'registrant-c_6716229',
                name: 'Registrant[c_6716229]',
                type: 'tel',
                label: 'Office Phone',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716229'
            },
            {
                id: 'registrant-mobile_phone',
                name: 'Registrant[mobile_phone]',
                type: 'tel',
                label: 'Mobile Phone',
                ariaDescribedBy: 'error-registrant-mobile_phone'
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
                        ariaDescribedBy: 'error-address-registrant-work_address_id-line_1'
                    },
                    {
                        id: 'address-registrant-work_address_id-line_2',
                        name: 'Address[Registrant][work_address_id][line_2]',
                        type: 'text',
                        label: 'Address Line 2',
                        placeholder: 'Address Line 2',
                        autoComplete: 'address-line2',
                        ariaDescribedBy: 'error-address-registrant-work_address_id-line_2'
                    },
                    {
                        id: 'address-registrant-work_address_id-city',
                        name: 'Address[Registrant][work_address_id][city]',
                        type: 'text',
                        label: 'City',
                        autoComplete: 'address-level2',
                        ariaDescribedBy: 'error-address-registrant-work_address_id-city'
                    },
                    {
                        id: 'country-select',
                        name: 'Address[Registrant][work_address_id][country_code]',
                        type: 'select',
                        label: 'Country',
                        autoComplete: 'country',
                        options: [] // Will be populated by CountrySelect component
                    },
                    {
                        id: 'address-registrant-work_address_id-state',
                        name: 'Address[Registrant][work_address_id][state]',
                        type: 'text',
                        label: 'State / Province / County',
                        ariaDescribedBy: 'error-address-registrant-work_address_id-state'
                    },
                    {
                        id: 'address-registrant-work_address_id-zip',
                        name: 'Address[Registrant][work_address_id][zip]',
                        type: 'text',
                        label: 'Zip/Postal Code',
                        autoComplete: 'postal-code',
                        ariaDescribedBy: 'error-address-registrant-work_address_id-zip'
                    }
                ]
            },
            {
                id: 'registrant-profile_picture',
                name: 'Registrant[profile_picture]',
                type: 'file',
                label: 'Upload a Profile Picture',
                accept: 'image/*',
                ariaDescribedBy: 'error-registrant-profile_picture'
            }
        ]
    },
    // Stage 2: Additional Details
    {
        title: 'Additional Details',
        description: 'Please provide additional information for your registration.',
        fields: [
            {
                id: 'registrant-c_6716240',
                name: 'Registrant[c_6716240]',
                type: 'text',
                label: 'Name for Credentials',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716240',
                hintText: 'Full name as you would like it to appear on credentials and onsite materials.'
            },
            {
                id: 'registrant-c_6716241',
                name: 'Registrant[c_6716241]',
                type: 'text',
                label: 'Organization for Credentials',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716241',
                hintText: 'Organization name as you would like it to appear on credentials and onsite materials.'
            },
            {
                id: 'registrant-c_6716242',
                name: 'Registrant[c_6716242]',
                type: 'text',
                label: 'Emergency Contact Name',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716242',
                hintText: 'Please provide a contact in case of emergency while you are with us in Kiawah.'
            },
            {
                id: 'registrant-c_6716243',
                name: 'Registrant[c_6716243]',
                type: 'text',
                label: 'Emergency Contact Relation',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716243'
            },
            {
                id: 'registrant-c_6716244',
                name: 'Registrant[c_6716244]',
                type: 'email',
                label: 'Emergency Contact Email',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716244'
            },
            {
                id: 'registrant-c_6716246',
                name: 'Registrant[c_6716246]',
                type: 'tel',
                label: 'Emergency Contact Phone',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716246'
            },
            {
                id: 'registrant-c_6716247',
                name: 'Registrant[c_6716247]',
                type: 'textarea',
                label: 'Dietary Restrictions or Allergies',
                placeholder: 'Dietary Restrictions or Allergies',
                multiline: true,
                minRows: 3,
                ariaDescribedBy: 'error-registrant-c_6716247'
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
                    { value: '38978944', label: 'XX Large' }
                ]
            }
        ]
    },
    // Stage 3: Event Details & Contacts
    {
        title: 'Event Details & Contacts',
        description: 'Please provide contact information and event preferences.',
        fields: [
            {
                id: 'registrant-c_6716225',
                name: 'Registrant[c_6716225]',
                type: 'text',
                label: 'Point of Contact Name',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716225'
            },
            {
                id: 'registrant-c_6716226',
                name: 'Registrant[c_6716226]',
                type: 'text',
                label: 'Point of Contact Title',
                ariaDescribedBy: 'error-registrant-c_6716226'
            },
            {
                id: 'registrant-c_6716231',
                name: 'Registrant[c_6716231]',
                type: 'email',
                label: 'Point of Contact Email',
                required: true,
                ariaDescribedBy: 'error-registrant-c_6716231'
            },
            {
                id: 'registrant-c_6716232',
                name: 'Registrant[c_6716232]',
                type: 'tel',
                label: 'Point of Contact Phone',
                ariaDescribedBy: 'error-registrant-c_6716232'
            },
            {
                id: 'registrant-c_6716234',
                name: 'Registrant[c_6716234]',
                type: 'text',
                label: 'Secondary Point of Contact Name',
                ariaDescribedBy: 'error-registrant-c_6716234'
            },
            {
                id: 'registrant-c_6716236',
                name: 'Registrant[c_6716236]',
                type: 'email',
                label: 'Secondary Point of Contact Email',
                ariaDescribedBy: 'error-registrant-c_6716236'
            },
            {
                id: 'registrant-c_6716237',
                name: 'Registrant[c_6716237]',
                type: 'tel',
                label: 'Secondary Point of Contact Phone',
                ariaDescribedBy: 'error-registrant-c_6716237'
            },
            {
                id: 'registrant-c_6832581',
                name: 'Registrant[c_6832581]',
                type: 'text',
                label: 'Guest Name',
                ariaDescribedBy: 'error-registrant-c_6832581'
            },
            {
                id: 'registrant-c_6716248',
                name: 'Registrant[c_6716248]',
                type: 'text',
                label: 'Guest Relation',
                ariaDescribedBy: 'error-registrant-c_6716248'
            },
            {
                id: 'registrant-c_6716239',
                name: 'Registrant[c_6716239]',
                type: 'email',
                label: 'Guest Email',
                ariaDescribedBy: 'error-registrant-c_6716239'
            },
            {
                id: 'registrant-c_6716267',
                name: 'Registrant[c_6716267]',
                type: 'checkbox-group',
                label: 'Complimentary accommodations are provided at The Boca Raton the nights of March 18 and March 19.',
                ariaDescribedBy: 'error-registrant-c_6716267',
                defaultValue: [],
                options: [
                    {
                        value: '38978933',
                        label: 'I will use my complimentary room the night of March 18.',
                        ariaLabel: 'I will use my complimentary room the night of March 18.'
                    },
                    {
                        value: '38978934',
                        label: 'I will use my complimentary room the night of March 19.',
                        ariaLabel: 'I will use my complimentary room the night of March 19.'
                    }
                ]
            },
            {
                id: 'registrant-c_6716269',
                name: 'Registrant[c_6716269]',
                type: 'checkbox-group',
                label: 'Which nights will you attend dinner?',
                ariaDescribedBy: 'error-registrant-c_6716269',
                defaultValue: [],
                options: [
                    {
                        value: '38978935',
                        label: 'I will attend the Dinner on March 18.',
                        ariaLabel: 'I will attend the Dinner on March 18.'
                    },
                    {
                        value: '38978936',
                        label: 'I will attend the Dinner on March 19.',
                        ariaLabel: 'I will attend the Dinner on March 19.'
                    }
                ]
            },
            {
                id: 'registrant-c_6838231',
                name: 'Registrant[c_6838231]',
                type: 'checkbox-group',
                label: 'Activities',
                ariaDescribedBy: 'error-registrant-c_6838231',
                defaultValue: [],
                options: [
                    {
                        value: '39626531',
                        label: 'Pickleball tournament (upriver / downriver style) on March 19',
                        ariaLabel: 'Pickleball tournament (upriver / downriver style) on March 19'
                    },
                    {
                        value: '39626575',
                        label: 'Golf - Full round',
                        ariaLabel: 'Golf - Full round'
                    },
                    {
                        value: '39626586',
                        label: 'Golf - 9 holes',
                        ariaLabel: 'Golf - 9 holes'
                    },
                    {
                        value: '39626588',
                        label: 'Golf challenge with a pro',
                        ariaLabel: 'Golf challenge with a pro'
                    },
                    {
                        value: '39626589',
                        label: 'Tennis',
                        ariaLabel: 'Tennis'
                    },
                    {
                        value: '39626590',
                        label: 'Tennis challenge with a pro',
                        ariaLabel: 'Tennis challenge with a pro'
                    },
                    {
                        value: '39626592',
                        label: 'Sailing excursion with a SailGP team member',
                        ariaLabel: 'Sailing excursion with a SailGP team member'
                    },
                    {
                        value: '39626591',
                        label: "Please don't bother me, I'll be at the spa :)",
                        ariaLabel: "Please don't bother me, I'll be at the spa :)"
                    }
                ]
            }
        ]
    }
]