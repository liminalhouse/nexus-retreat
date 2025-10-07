import { NextRequest, NextResponse } from 'next/server'
import {
    createSwoogoRegistrant,
    sendRegistrantEmail,
    type SwoogoRegistrant,
    SWOOGO_FIELD_ID_TO_KEY,
} from '@/utils/swoogo'
import { z } from 'zod'
import { getAllFormFields } from '../../register/formConfig'

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
        return `+1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(
            7
        )}`
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
            ? z
                  .email(`${fieldLabel} must be valid`)
                  .min(1, `${fieldLabel} is required`)
            : z.email().optional().or(z.literal(''))
    }

    if (field.validationType === 'phone') {
        return isRequired
            ? z
                  .string()
                  .min(1, `${fieldLabel} is required`)
                  .refine((phone) => validatePhoneNumber(phone), {
                      message: `${fieldLabel} must be a valid phone number`,
                  })
            : z
                  .string()
                  .optional()
                  .refine((phone) => !phone || validatePhoneNumber(phone), {
                      message: `${fieldLabel} must be a valid phone number`,
                  })
    }

    if (field.type === 'checkbox-group') {
        return z.array(z.string()).optional()
    }

    if (field.type === 'file') {
        return isRequired
            ? z
                  .any()
                  .refine(
                      (file) =>
                          file instanceof File || typeof file === 'string',
                      {
                          message: `${fieldLabel} must be a valid file`,
                      }
                  )
            : z.any().optional()
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
        work_address_id: z
            .object({
                line_1: z.string().optional(),
                line_2: z.string().optional(),
                city: z.string().optional(),
                state: z.string().optional(),
                zip: z.string().optional(),
                country_code: z.string().optional(),
            })
            .optional(),
    }

    // Add all form fields dynamically
    getAllFormFields().forEach((field) => {
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
    if (formData.mobile_phone)
        swoogoData.mobile_phone = formatPhoneNumber(formData.mobile_phone)
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
        if (address.country_code)
            swoogoData.work_address_country_code = address.country_code
    }

    // Process all form fields dynamically using form config
    getAllFormFields().forEach((field) => {
        const key = field.formDataKey
        if (!key || key === 'work_address_id' || !formData[key]) return

        const value = formData[key]

        // Skip empty values
        if (value === '' || value === null || value === undefined) return
        if (Array.isArray(value) && value.length === 0) return

        // Handle work address fields with dot notation
        if (key.startsWith('work_address_id.')) {
            const addressField = key.replace('work_address_id.', '')
            const swoogoKey =
                `work_address_${addressField}` as keyof SwoogoRegistrant
            if (typeof value === 'string' && value.trim() !== '') {
                swoogoData[swoogoKey] = value
            }
        }
        // Handle different field types
        else if (field.validationType === 'phone') {
            if (typeof value === 'string' && value.trim() !== '') {
                swoogoData[key as keyof SwoogoRegistrant] =
                    formatPhoneNumber(value)
            }
        } else if (field.validationType === 'email') {
            if (typeof value === 'string' && value.trim() !== '') {
                swoogoData[key as keyof SwoogoRegistrant] = value
            }
        } else if (field.type === 'checkbox-group') {
            if (Array.isArray(value) && value.length > 0) {
                swoogoData[key as keyof SwoogoRegistrant] = value
            }
        } else if (field.type === 'file') {
            if (value instanceof File) {
                // This shouldn't happen anymore since we convert to base64 on the client
                console.warn(`Unexpected File object for ${key}:`, value.name)
            } else if (typeof value === 'string' && value.trim() !== '') {
                // Handle base64 encoded file data
                if (value.startsWith('data:')) {
                    // Extract just the base64 data without the data URL prefix
                    const base64Data = value.split(',')[1]
                    if (base64Data) {
                        swoogoData[key as keyof SwoogoRegistrant] = base64Data
                        console.info(
                            `Processed file upload for ${key}: ${base64Data.length} characters`
                        )
                    }
                } else {
                    // Handle other string formats (URL, etc.)
                    swoogoData[key as keyof SwoogoRegistrant] = value
                }
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
        const body = await request.json()
        const validatedData = registrationSchema.parse(body)
        const { event_id, ...formData } = validatedData

        // Check if we have required environment variables
        if (
            !process.env.SWOOGO_CONSUMER_KEY ||
            !process.env.SWOOGO_CONSUMER_SECRET
        ) {
            throw new Error('Swoogo API credentials not configured')
        }

        // Transform form data to Swoogo format
        const swoogoData = transformFormDataToSwoogo(formData)
        const result = await createSwoogoRegistrant(`${event_id}`, swoogoData)

        // Send confirmation email
        try {
            await sendRegistrantEmail(result.id.toString(), 'registration_created')
        } catch (emailError) {
            // Log the error but don't fail the registration
            console.error('Failed to send confirmation email:', emailError)
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful',
                registrant: result,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)

        if (error instanceof z.ZodError) {
            console.error('Validation errors:', error)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: error,
                },
                { status: 400 }
            )
        }

        if (error instanceof Error) {
            console.error('Registration error:', error.message)

            // Handle Swoogo validation errors
            if ((error as any).validationErrors) {
                const validationErrors = (error as any).validationErrors
                const fieldErrors: Record<string, string> = {}

                // Use the Swoogo field IDs directly since our form uses them as formDataKey
                validationErrors.forEach(
                    (err: { field: string; message: string }) => {
                        fieldErrors[err.field] = err.message
                    }
                )

                return NextResponse.json(
                    {
                        success: false,
                        message:
                            'Please fix the validation errors and try again.',
                        fieldErrors,
                    },
                    { status: 400 }
                )
            }

            // Handle specific Swoogo validation errors
            if (
                error.message.includes(
                    'This email address has not been recognized'
                )
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            'This email address is not on the invitation list. Please contact vslattery@globalsportsleaders.com or +1-917-803-1481 for registration assistance.',
                        error: 'email_not_recognized',
                    },
                    { status: 400 }
                )
            }

            if (
                error.message.includes('email') &&
                error.message.includes('already')
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            'This email address is already registered for this event.',
                        error: 'email_already_registered',
                    },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                {
                    success: false,
                    message: 'Registration failed',
                    error: error.message,
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Unknown error occurred',
            },
            { status: 500 }
        )
    }
}
