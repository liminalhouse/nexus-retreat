import { redirect } from 'next/navigation'
import { getSession } from '@/utils/auth'
import UI from './ui'

export const metadata = {
    title: 'Register - Nexus Retreat',
    description: '',
}

export default async function RegisterPage() {
    const session = await getSession()

    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    return <UI />
}
