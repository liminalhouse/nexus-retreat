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
        console.log(
            `Page ${currentPage} response:`,
            JSON.stringify(listData, null, 2)
        )

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
