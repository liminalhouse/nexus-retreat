import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <header className={styles.header}></header>
                <div className={styles.title}>
                    <Image
                        src="/icons/favicon.svg"
                        alt="Sportico Nexus logo"
                        width={30}
                        height={30}
                        priority
                    />
                    <h1 className={styles.title}>Nexus Retreat</h1>
                </div>
                <div className={styles.ctas}></div>
            </main>
            <footer className={styles.footer}>Copyright © Sportico 2025</footer>
        </div>
    )
}
