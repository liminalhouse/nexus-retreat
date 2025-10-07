import { redirect } from 'next/navigation'
import { getSession } from '@/utils/auth'
import UI from './ui'

export const metadata = {
    title: 'Register - Nexus Retreat',
    description: '',
}

export default async function RegisterPage() {
    const session = await getSession()

    // TODO: Remove production later
    if (!session.isAuthenticated || process.env.NODE_ENV === 'production') {
        redirect('/sign-in')
    }

    return <UI />
}
