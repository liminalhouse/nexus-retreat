import UI from './ui'

export interface RegisterProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export default async function Register(props: RegisterProps) {
    const searchParams = await props.searchParams

    return <UI searchParams={searchParams} />
}