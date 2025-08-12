import { getSession } from '@/utils/auth'
import { redirect } from 'next/navigation'
import UI from './ui'

export interface SignInProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export default async function SignIn(props: SignInProps) {
    const searchParams = await props.searchParams
    const session = await getSession()

    // if (session.isAuthenticated) {
    //     redirect('/')
    // }

    return <UI searchParams={searchParams} />
}
