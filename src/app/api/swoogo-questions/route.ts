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
            // Fetch all questions for the event, then get detailed data for each
            const questions = await fetchSwoogoQuestions(eventId)

            // Fetch detailed information for each question
            const detailedQuestions = await Promise.all(
                questions.map(async (question) => {
                    try {
                        const detailedQuestion = await fetchSwoogoQuestion(question.id)
                        return detailedQuestion
                    } catch (error) {
                        console.error(`Failed to fetch details for question ${question.id}:`, error)
                        // Return the basic question data if detailed fetch fails
                        return question
                    }
                })
            )

            data = detailedQuestions
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
