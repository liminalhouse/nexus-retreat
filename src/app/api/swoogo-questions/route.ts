import { NextRequest, NextResponse } from 'next/server'
import { fetchSwoogoQuestions, fetchSwoogoQuestion } from '@/utils/swoogo'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const questionId = searchParams.get('id')
        const eventId = process.env.NEXT_PUBLIC_SWOOGO_EVENT_ID

        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            )
        }

        let data
        if (questionId) {
            // Fetch a single question
            data = await fetchSwoogoQuestion(questionId)
        } else {
            // Fetch all questions for the event
            data = await fetchSwoogoQuestions(eventId)
        }

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error fetching Swoogo questions:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch questions from Swoogo',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
