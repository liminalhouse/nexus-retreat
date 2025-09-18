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
    profile_picture?: any | undefined
    // Custom fields with c_ prefix
    c_6716229?: string // office_phone
    c_6716230?: string // title (legacy)
    c_6716228?: string // organization (legacy)
    c_6716240?: string // name_for_credentials
    c_6716241?: string // organization_for_credentials
    c_6716242?: string // emergency_contact_name
    c_6716243?: string // emergency_contact_relation
    c_6716244?: string // emergency_contact_email
    c_6716246?: string // emergency_contact_phone
    c_6716247?: string // dietary_restrictions
    c_6716271?: string // jacket_size
    c_6716225?: string // point_of_contact_name
    c_6716226?: string // point_of_contact_title
    c_6716231?: string // point_of_contact_email
    c_6716232?: string // point_of_contact_phone
    c_6716234?: string // secondary_point_of_contact_name
    c_6716236?: string // secondary_point_of_contact_email
    c_6716237?: string // secondary_point_of_contact_phone
    c_6832581?: string // guest_name
    c_6716248?: string // guest_relation
    c_6716263?: string // guest_email
    c_6716267?: string[] // complimentary_accommodations
    c_6716269?: string[] // dinner_attendance
    c_6838231?: string[] // activities
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
        throw new Error(
            `Failed to create registrant: ${response.statusText} - ${errorText}`
        )
    }

    return await response.json()
}

export type { SwoogoRegistrant, SwoogoRegistrantResponse }
