import { getSession } from '@/utils/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.scss'
import FAQ from './components/FAQ'
import Logo from './components/Logo'
import { Button } from '@mui/material'

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
                        George Pyne and Jay Penske will host an invitation-only
                        gathering of international sports leaders, March 18 -
                        20, 2026 at{' '}
                        <a
                            href="https://www.thebocaraton.com/"
                            target="_blank"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            The Boca Raton
                        </a>{' '}
                        resort in Boca Raton, Florida. Now in its fifth year,
                        this retreat remains the only event of its kind
                        dedicated exclusively to the global sports leadership.
                    </p>
                    {process.env.VERCEL_ENV !== 'production' && (
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                zIndex: 1,
                                background: `var(--blue-gradient)`,
                                letterSpacing: '0.1rem',
                                transition: 'all 0.3s linear',
                                color: 'white !important',
                                marginTop: '2rem',
                                '&:hover': {
                                    background: 'var(--boca-navy)',
                                    color: 'var(--link-hover) !important',
                                },
                            }}
                            href="/register"
                        >
                            Register &raquo;
                        </Button>
                    )}
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
