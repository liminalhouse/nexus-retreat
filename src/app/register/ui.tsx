'use client'

import styles from './register.module.scss'
import Image from 'next/image'
import { Button } from '@mui/material'

const UI = ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    return (
        <div className={styles.wrapper}>
            <Image
                src="/icons/nexus-logo.svg"
                alt="Bruin Nexus logo"
                width={1180 / 4}
                height={258 / 4}
                priority={true}
                className={styles.logo}
            />
            <h1 className={styles.title}>Event Registration</h1>
            <p className={styles.text}>
                Please fill out the form below to register for the retreat.
            </p>
            <div className={styles.formContainer}>
                {/* Form fields will be populated from Swoogo API */}
                <div className={styles.loading}>
                    Loading registration form...
                </div>
            </div>
        </div>
    )
}

export default UI