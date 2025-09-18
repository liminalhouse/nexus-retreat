import { NextRequest, NextResponse } from 'next/server'
import { createSwoogoRegistrant, type SwoogoRegistrant } from '@/utils/swoogo'
import { z } from 'zod'
import {
    getRequiredFields,
    getPhoneFields,
    getEmailFields,
    getAllFormFields,
    getFieldByFormDataKey
} from '../../register-alt/formConfig'

// Phone number validation and formatting
function formatPhoneNumber(phone: string): string {
    if (!phone) return ''

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')

    // Try different formats that Swoogo might accept
    if (digits.length === 10) {
        // Try format: XXX-XXX-XXXX
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    }

    // If it's 11 digits and starts with 1, format as +1-XXX-XXX-XXXX
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
    }

    // For international numbers, return with + prefix
    if (digits.length > 10) {
        return `+${digits}`
    }

    // If less than 10 digits, return just the digits
    return digits
}

function validatePhoneNumber(phone: string): boolean {
    if (!phone) return true // Optional fields can be empty

    const digits = phone.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 15
}

// Dynamic schema generation based on form config
function createFieldSchema(field: any): z.ZodTypeAny {
    const isRequired = field.required
    const fieldLabel = field.label

    if (field.validationType === 'email') {
        return isRequired
            ? z.string().email(`${fieldLabel} must be valid`).min(1, `${fieldLabel} is required`)
            : z.string().email().optional().or(z.literal(''))
    }

    if (field.validationType === 'phone') {
        return isRequired
            ? z.string().min(1, `${fieldLabel} is required`).refine(
                (phone) => validatePhoneNumber(phone),
                { message: `${fieldLabel} must be a valid phone number` }
            )
            : z.string().optional().refine(
                (phone) => !phone || validatePhoneNumber(phone),
                { message: `${fieldLabel} must be a valid phone number` }
            )
    }

    if (field.type === 'checkbox-group') {
        return z.array(z.string()).optional()
    }

    // Default text validation
    return isRequired
        ? z.string().min(1, `${fieldLabel} is required`)
        : z.string().optional()
}

// Generate schema dynamically from form config
function generateRegistrationSchema() {
    const schemaObject: any = {
        // Always required
        event_id: z.string().min(1, 'Event ID is required'),
        // Address object
        work_address_id: z.object({
            line_1: z.string().optional(),
            line_2: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zip: z.string().optional(),
            country_code: z.string().optional(),
        }).optional(),
    }

    // Add all form fields dynamically
    getAllFormFields().forEach(field => {
        if (field.formDataKey && field.formDataKey !== 'work_address_id') {
            schemaObject[field.formDataKey] = createFieldSchema(field)
        }
    })

    return z.object(schemaObject)
}

const registrationSchema = generateRegistrationSchema()

function transformFormDataToSwoogo(formData: any): SwoogoRegistrant {
    const swoogoData: SwoogoRegistrant = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
    }

    // Add optional basic fields
    if (formData.prefix) swoogoData.prefix = formData.prefix
    if (formData.middle_name) swoogoData.middle_name = formData.middle_name
    if (formData.mobile_phone) swoogoData.mobile_phone = formatPhoneNumber(formData.mobile_phone)
    if (formData.title) swoogoData.title = formData.title
    if (formData.organization) swoogoData.organization = formData.organization

    // Transform work address
    if (formData.work_address_id) {
        const address = formData.work_address_id
        if (address.line_1) swoogoData.work_address_line_1 = address.line_1
        if (address.line_2) swoogoData.work_address_line_2 = address.line_2
        if (address.city) swoogoData.work_address_city = address.city
        if (address.state) swoogoData.work_address_state = address.state
        if (address.zip) swoogoData.work_address_zip = address.zip
        if (address.country_code) swoogoData.work_address_country_code = address.country_code
    }

    // Process all form fields dynamically using form config
    getAllFormFields().forEach(field => {
        const key = field.formDataKey
        if (!key || key === 'work_address_id' || !formData[key]) return

        const value = formData[key]

        // Skip empty values
        if (value === '' || value === null || value === undefined) return
        if (Array.isArray(value) && value.length === 0) return

        // Handle different field types
        if (field.validationType === 'phone') {
            if (typeof value === 'string' && value.trim() !== '') {
                swoogoData[key as keyof SwoogoRegistrant] = formatPhoneNumber(value)
            }
        } else if (field.validationType === 'email') {
            if (typeof value === 'string' && value.trim() !== '') {
                swoogoData[key as keyof SwoogoRegistrant] = value
            }
        } else if (field.type === 'checkbox-group') {
            if (Array.isArray(value) && value.length > 0) {
                swoogoData[key as keyof SwoogoRegistrant] = value
            }
        } else {
            // Handle text and other field types
            if (typeof value === 'string' && value.trim() !== '') {
                swoogoData[key as keyof SwoogoRegistrant] = value
            } else if (typeof value !== 'string') {
                swoogoData[key as keyof SwoogoRegistrant] = value
            }
        }
    })

    return swoogoData
}

export async function POST(request: NextRequest) {
    try {
        console.log('Register-alt API called')
        const body = await request.json()
        console.log('Request body:', JSON.stringify(body, null, 2))

        const validatedData = registrationSchema.parse(body)
        console.log('Validated data:', JSON.stringify(validatedData, null, 2))

        const { event_id, ...formData } = validatedData
        console.log('Event ID:', event_id)

        // Check if we have required environment variables
        if (!process.env.SWOOGO_CONSUMER_KEY || !process.env.SWOOGO_CONSUMER_SECRET) {
            throw new Error('Swoogo API credentials not configured')
        }

        // Transform form data to Swoogo format
        const swoogoData = transformFormDataToSwoogo(formData)
        console.log('Transformed Swoogo data:', JSON.stringify(swoogoData, null, 2))

        const result = await createSwoogoRegistrant(event_id, swoogoData)
        console.log('Swoogo API result:', JSON.stringify(result, null, 2))

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful',
                registrant: result
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)

        if (error instanceof z.ZodError) {
            console.error('Validation errors:', error.errors)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: error.errors
                },
                { status: 400 }
            )
        }

        if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)

            // Handle specific Swoogo validation errors
            if (error.message.includes('This email address has not been recognized')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'This email address is not on the invitation list. Please contact vslattery@globalsportsleaders.com or +1-917-803-1481 for registration assistance.',
                        error: 'email_not_recognized'
                    },
                    { status: 400 }
                )
            }

            if (error.message.includes('email') && error.message.includes('already')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'This email address is already registered for this event.',
                        error: 'email_already_registered'
                    },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                {
                    success: false,
                    message: 'Registration failed',
                    error: error.message
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Unknown error occurred'
            },
            { status: 500 }
        )
    }
}