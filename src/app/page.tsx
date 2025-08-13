import { getSession } from '@/utils/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.scss'
import FAQ from './components/FAQ'
import Logo from './components/Logo'

export default async function Home() {
    const session = await getSession()

    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.heroImg}>
                    <Image
                        src="/images/boca-raton-day.jpeg"
                        alt="Boca Raton Night"
                        width="1080"
                        height="608"
                    />
                </div>
                <div className={styles.logo}>
                    <div className={'mobileOnly'}>
                        <Logo $logoType="default" />
                    </div>
                    <div className={'desktopOnly'}>
                        <Logo $logoType="white" />
                    </div>
                </div>
                <div className={styles.intro}>
                    <p className={styles.text}>
                        George and Jay will be hosting this year&apos;s
                        executive retreat at{' '}
                        <a
                            href="https://www.thebocaraton.com/"
                            target="_blank"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            The Boca Raton
                        </a>
                        , from March 18-20, 2026. The Harborside resort is known
                        for its modern design, half-mile private beach, multiple
                        pools, state of the art sport facilities, and spa. We
                        are certain this oasis will perfectly fit all
                        guest&apos;s needs. You can expect the same high-touch
                        event you experienced at The Sanctuary in Kiawah.
                        <br /> <br />
                        The event begins Wednesday March 18, 2026 in the evening
                        and will conclude mid-morning March 20, 2026. There will
                        be a reception and dinner on March 18th with programming
                        and activities until closing remarks on March 20th.
                    </p>
                </div>
            </header>
            <main className={styles.main}>
                <FAQ />
                <div className={styles.ctas}></div>
            </main>
            <footer className={styles.footer}>
                Copyright © Bruin Capital Holdings, LLC 2025. All rights
                reserved.
            </footer>
        </div>
    )
}
