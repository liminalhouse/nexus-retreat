'use client'

import useSWR from 'swr'
import styles from './register.module.scss'
import Image from 'next/image'
import {
    Button,
    Input,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material'

interface SwoogoQuestion {
    id: number
    name: string
    attribute: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RegistrationForm = () => {
    const { data, error, isLoading } = useSWR('/api/swoogo-questions', fetcher)

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <CircularProgress />
                <p>Loading registration form...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>Failed to load registration form. Please try again.</p>
            </div>
        )
    }

    const questions: SwoogoQuestion[] = data?.data || []

    const renderField = (question: SwoogoQuestion) => {
        const { id, name, attribute } = question

        // Skip certain fields that shouldn't be shown in the form
        if (
            attribute === 'password' ||
            attribute === 'vat_number' ||
            attribute.startsWith('h_') ||
            attribute.startsWith('sq_')
        ) {
            return null
        }

        // Handle special field types
        if (attribute === 'reg_type_id') {
            return (
                <FormControl key={id} fullWidth className={styles.formField}>
                    <InputLabel>{name}</InputLabel>
                    <Select name={attribute} label={name}>
                        <MenuItem value="">Select...</MenuItem>
                        {/* Add actual options from API if available */}
                    </Select>
                </FormControl>
            )
        }

        // Determine input type based on attribute
        let inputType = 'text'
        if (attribute === 'email' || attribute.includes('email')) {
            inputType = 'email'
        } else if (attribute.includes('phone')) {
            inputType = 'tel'
        }

        return (
            <div key={id} className={styles.inputWrapper}>
                <Input
                    name={attribute}
                    type={inputType}
                    placeholder={name}
                    fullWidth
                    required={['first_name', 'last_name', 'email'].includes(
                        attribute
                    )}
                />
                <span className={styles.bar} />
            </div>
        )
    }

    return (
        <form className={styles.form}>
            <div className={styles.inputGroup}>
                {questions.map(renderField).filter(Boolean)}
            </div>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.submitButton}
            >
                Register
            </Button>
        </form>
    )
}

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
                <RegistrationForm />
                {searchParams.success && (
                    <small className={styles.success}>
                        Registration successful! Thank you for registering.
                    </small>
                )}
                {searchParams.error && (
                    <small className={styles.error}>
                        Registration failed. Please try again.
                    </small>
                )}
            </div>
        </div>
    )
}

export default UI
