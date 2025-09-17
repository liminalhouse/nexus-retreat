import { NextRequest, NextResponse } from 'next/server'
import { createSwoogoRegistrant, type SwoogoRegistrant } from '@/utils/swoogo'
import { z } from 'zod'

const registrationSchema = z.object({
    // Basic required fields
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    event_id: z.string().min(1, 'Event ID is required'),

    // Optional basic fields
    prefix: z.string().optional(),
    middle_name: z.string().optional(),
    mobile_phone: z.string().optional(),
    title: z.string().optional(),
    organization: z.string().optional(),

    // Work address fields
    work_address_id: z.object({
        line_1: z.string().optional(),
        line_2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country_code: z.string().optional(),
    }).optional(),

    // Custom fields
    c_6716229: z.string().optional(), // office_phone
    c_6716230: z.string().optional(), // title (legacy)
    c_6716228: z.string().optional(), // organization (legacy)
    c_6716240: z.string().optional(), // name_for_credentials
    c_6716241: z.string().optional(), // organization_for_credentials
    c_6716242: z.string().optional(), // emergency_contact_name
    c_6716243: z.string().optional(), // emergency_contact_relation
    c_6716244: z.string().optional(), // emergency_contact_email
    c_6716246: z.string().optional(), // emergency_contact_phone
    c_6716247: z.string().optional(), // dietary_restrictions
    c_6716271: z.string().optional(), // jacket_size
    c_6716225: z.string().optional(), // point_of_contact_name
    c_6716226: z.string().optional(), // point_of_contact_title
    c_6716231: z.string().optional(), // point_of_contact_email
    c_6716232: z.string().optional(), // point_of_contact_phone
    c_6716234: z.string().optional(), // secondary_point_of_contact_name
    c_6716236: z.string().optional(), // secondary_point_of_contact_email
    c_6716237: z.string().optional(), // secondary_point_of_contact_phone
    c_6832581: z.string().optional(), // guest_name
    c_6716248: z.string().optional(), // guest_relation
    c_6716239: z.string().optional(), // guest_email
    c_6716267: z.array(z.string()).optional(), // complimentary_accommodations
    c_6716269: z.array(z.string()).optional(), // dinner_attendance
    c_6838231: z.array(z.string()).optional(), // activities
})

function transformFormDataToSwoogo(formData: any): SwoogoRegistrant {
    const swoogoData: SwoogoRegistrant = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
    }

    // Add optional basic fields
    if (formData.prefix) swoogoData.prefix = formData.prefix
    if (formData.middle_name) swoogoData.middle_name = formData.middle_name
    if (formData.mobile_phone) swoogoData.mobile_phone = formData.mobile_phone
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

    // Add all custom fields (c_ prefixed)
    const customFields = [
        'c_6716229', 'c_6716230', 'c_6716228', 'c_6716240', 'c_6716241',
        'c_6716242', 'c_6716243', 'c_6716244', 'c_6716246', 'c_6716247',
        'c_6716271', 'c_6716225', 'c_6716226', 'c_6716231', 'c_6716232',
        'c_6716234', 'c_6716236', 'c_6716237', 'c_6832581', 'c_6716248',
        'c_6716239', 'c_6716267', 'c_6716269', 'c_6838231'
    ]

    customFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== '' && formData[field] !== null) {
            // Handle arrays (checkbox groups)
            if (Array.isArray(formData[field])) {
                if (formData[field].length > 0) {
                    swoogoData[field as keyof SwoogoRegistrant] = formData[field]
                }
            } else {
                swoogoData[field as keyof SwoogoRegistrant] = formData[field]
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