interface SwoogoTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
}

interface SwoogoQuestion {
    id: string
    type: string
    question: string
    required: boolean
    options?: string[]
    [key: string]: any
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getSwoogoAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.token
    }

    const consumerKey = process.env.SWOOGO_CONSUMER_KEY
    const consumerSecret = process.env.SWOOGO_CONSUMER_SECRET
    const baseUrl = process.env.SWOOGO_BASE_URL || 'https://api.swoogo.com'

    if (!consumerKey || !consumerSecret) {
        throw new Error('Swoogo API credentials not configured')
    }

    // Step 1: Get OAuth2 access token
    const credentials = Buffer.from(
        `${consumerKey}:${consumerSecret}`
    ).toString('base64')

    const tokenResponse = await fetch(`${baseUrl}/api/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    if (!tokenResponse.ok) {
        throw new Error(
            `Failed to get access token: ${tokenResponse.statusText}`
        )
    }

    const tokenData: SwoogoTokenResponse = await tokenResponse.json()

    // Cache the token with a buffer (expire 5 minutes early)
    const expiresAt = Date.now() + (tokenData.expires_in - 300) * 1000
    cachedToken = { token: tokenData.access_token, expiresAt }

    return tokenData.access_token
}

export async function fetchSwoogoQuestions(
    eventId: string
): Promise<SwoogoQuestion[]> {
    const baseUrl = process.env.SWOOGO_BASE_URL || 'https://api.swoogo.com'
    const accessToken = await getSwoogoAccessToken()

    // Step 2: Fetch all event questions (with pagination)
    const allQuestions: SwoogoQuestion[] = []
    let currentPage = 1
    let totalPages = 1

    do {
        const listResponse = await fetch(
            `${baseUrl}/api/v1/event-questions?event_id=${eventId}&page=${currentPage}&sort=id`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        )

        if (!listResponse.ok) {
            const errorText = await listResponse.text()
            console.error(
                `Failed to fetch questions (page ${currentPage}):`,
                errorText
            )
            throw new Error(
                `Failed to fetch questions: ${listResponse.statusText}`
            )
        }

        const listData = await listResponse.json()
        if (listData.items && Array.isArray(listData.items)) {
            allQuestions.push(...listData.items)
        }

        // Update pagination info
        if (listData._meta) {
            totalPages = listData._meta.pageCount || 1
            currentPage = listData._meta.currentPage + 1
        } else {
            break
        }
    } while (currentPage <= totalPages)

    return allQuestions
}

export async function fetchSwoogoQuestion(
    questionId: string
): Promise<SwoogoQuestion> {
    const baseUrl = process.env.SWOOGO_BASE_URL || 'https://api.swoogo.com'
    const accessToken = await getSwoogoAccessToken()

    const response = await fetch(
        `${baseUrl}/api/v1/event-questions/${questionId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || data
}

export const SWOOGO_CONSTANTS = {
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email',
    prefix: 'prefix',
    middle_name: 'middle_name',
    mobile_phone: 'mobile_phone',
    // Work address fields
    work_address_line_1: 'work_address_id.line_1',
    work_address_line_2: 'work_address_id.line_2',
    work_address_city: 'work_address_id.city',
    work_address_state: 'work_address_id.state',
    work_address_zip: 'work_address_id.zip',
    work_address_country_code: 'work_address_id.country_code',
    // profile_picture: 'profile_picture', // Can't upload to Swoogo
    // Custom fields with c_ prefix
    office_phone: 'c_6716229',
    title: 'c_6716230',
    organization: 'company',
    name_for_credentials: 'c_6716240',
    organization_for_credentials: 'c_6716241',
    emergency_contact_name: 'c_6716242',
    emergency_contact_relation: 'c_6716243',
    emergency_contact_email: 'c_6716244',
    emergency_contact_phone: 'c_6716246',
    dietary_restrictions: 'c_6716247',
    jacket_size: 'c_6716271',
    point_of_contact_name: 'c_6716225',
    point_of_contact_title: 'c_6716226',
    point_of_contact_email: 'c_6716231',
    point_of_contact_phone: 'c_6716232',
    secondary_point_of_contact_name: 'c_6716234',
    secondary_point_of_contact_email: 'c_6716236',
    secondary_point_of_contact_phone: 'c_6716237',
    guest_name: 'c_6832581',
    guest_relation: 'c_6716248',
    guest_email: 'c_6716263',
    complimentary_accommodations: 'c_6716267',
    dinner_attendance: 'c_6716269',
    activities: 'c_6838231',
    // Credit card fields
    credit_card_holder_name: 'c_7045705',
    credit_card_number: 'c_6842687',
    credit_card_cvv: 'c_6842724',
    credit_card_expiry: 'c_7045598',
}

interface SwoogoRegistrant {
    first_name: string
    last_name: string
    email: string
    prefix?: string
    middle_name?: string
    mobile_phone?: string
    title?: string
    organization?: string
    // Work address fields
    work_address_line_1?: string
    work_address_line_2?: string
    work_address_city?: string
    work_address_state?: string
    work_address_zip?: string
    work_address_country_code?: string
    // profile_picture?: any | undefined // Can't upload to Swoogo
    // Custom fields with c_ prefix
    [SWOOGO_CONSTANTS.office_phone]?: string // office_phone
    [SWOOGO_CONSTANTS.title]?: string // title (legacy)
    [SWOOGO_CONSTANTS.organization]?: string // organization (legacy)
    [SWOOGO_CONSTANTS.name_for_credentials]?: string // name_for_credentials
    [SWOOGO_CONSTANTS.organization_for_credentials]?: string // organization_for_credentials
    [SWOOGO_CONSTANTS.emergency_contact_name]?: string // emergency_contact_name
    [SWOOGO_CONSTANTS.emergency_contact_relation]?: string // emergency_contact_relation
    [SWOOGO_CONSTANTS.emergency_contact_email]?: string // emergency_contact_email
    [SWOOGO_CONSTANTS.emergency_contact_phone]?: string // emergency_contact_phone
    [SWOOGO_CONSTANTS.dietary_restrictions]?: string // dietary_restrictions
    [SWOOGO_CONSTANTS.jacket_size]?: string // jacket_size
    [SWOOGO_CONSTANTS.point_of_contact_name]?: string // point_of_contact_name
    [SWOOGO_CONSTANTS.point_of_contact_title]?: string // point_of_contact_title
    [SWOOGO_CONSTANTS.point_of_contact_email]?: string // point_of_contact_email
    [SWOOGO_CONSTANTS.point_of_contact_phone]?: string // point_of_contact_phone
    [SWOOGO_CONSTANTS.secondary_point_of_contact_name]?: string // secondary_point_of_contact_name
    [SWOOGO_CONSTANTS.secondary_point_of_contact_email]?: string // secondary_point_of_contact_email
    [SWOOGO_CONSTANTS.secondary_point_of_contact_phone]?: string // secondary_point_of_contact_phone
    [SWOOGO_CONSTANTS.guest_name]?: string // guest_name
    [SWOOGO_CONSTANTS.guest_relation]?: string // guest_relation
    [SWOOGO_CONSTANTS.guest_email]?: string // guest_email
    [SWOOGO_CONSTANTS.complimentary_accommodations]?: string[] // complimentary_accommodations
    [SWOOGO_CONSTANTS.dinner_attendance]?: string[] // dinner_attendance
    [SWOOGO_CONSTANTS.activities]?: string[] // activities
}

interface SwoogoRegistrantResponse {
    id: string
    first_name: string
    last_name: string
    email: string
    [key: string]: string | string[] | undefined
}

export async function createSwoogoRegistrant(
    eventId: string,
    registrantData: SwoogoRegistrant
): Promise<SwoogoRegistrantResponse> {
    const baseUrl = process.env.SWOOGO_BASE_URL || 'https://api.swoogo.com'
    const accessToken = await getSwoogoAccessToken()

    const response = await fetch(`${baseUrl}/api/v1/registrants`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_id: eventId,
            ...registrantData,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()

        // Try to parse validation errors from Swoogo
        try {
            const errorData = JSON.parse(errorText)
            if (Array.isArray(errorData) && errorData.length > 0) {
                // Swoogo returns validation errors as an array
                const error: any = new Error('Validation failed')
                error.validationErrors = errorData
                throw error
            }
        } catch (parseError) {
            // If it's our validation error, re-throw it
            if (
                parseError instanceof Error &&
                (parseError as any).validationErrors
            ) {
                throw parseError
            }
            // Otherwise, it's a JSON parse error, continue to generic error
        }

        throw new Error(
            `Failed to create registrant: ${response.statusText} - ${errorText}`
        )
    }

    return await response.json()
}

export async function sendRegistrantEmail(
    registrantId: string,
    emailType:
        | 'registration_created'
        | 'registration_abandoned'
        | 'registration_modified'
        | 'registration_cancelled'
): Promise<{ sent: number; id: number }> {
    const baseUrl = process.env.SWOOGO_BASE_URL || 'https://api.swoogo.com'
    const accessToken = await getSwoogoAccessToken()

    const response = await fetch(
        `${baseUrl}/api/v1/registrants/${registrantId}/trigger-email/${emailType}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to send ${emailType} email:`, errorText)
        throw new Error(
            `Failed to send email: ${response.statusText} - ${errorText}`
        )
    }

    const responseData = await response.text()

    // Parse the response
    let parsedResponse
    try {
        parsedResponse = JSON.parse(responseData)
    } catch {
        parsedResponse = { sent: 0, id: parseInt(registrantId) }
    }

    if (parsedResponse.sent !== 1) {
        console.warn(
            `Email trigger succeeded but Swoogo did not send email. Check email template configuration.`
        )
    }

    return parsedResponse
}

export type { SwoogoRegistrant, SwoogoRegistrantResponse }
