import UI from './ui'

export interface RegisterProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export default async function Register(props: RegisterProps) {
    const searchParams = await props.searchParams

    let questions = []
    let error = null

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:1234'
        const response = await fetch(`${baseUrl}/api/swoogo-questions`)

        if (response.ok) {
            const data = await response.json()
            questions = data?.data || []
        } else {
            error = true
        }
    } catch (e) {
        error = true
    }

    return (
        <UI searchParams={searchParams} questions={questions} error={error} />
    )
}
