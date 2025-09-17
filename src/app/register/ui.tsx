'use client'

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

const RegistrationForm = ({
    questions,
    error,
}: {
    questions: SwoogoQuestion[]
    error: any
}) => {
    if (!questions?.length && !error) {
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

    const renderField = (question: SwoogoQuestion) => {
        const { id, name, attribute } = question

        // Skip certain fields that shouldn't be shown in the form
        if (attribute === 'password' || attribute === 'vat_number') {
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
                    autoComplete="true"
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
    questions,
    error,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
    questions: SwoogoQuestion[]
    error: any
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <Image
                                src="/icons/nexus-logo.svg"
                                alt="Bruin Nexus logo"
                                width={1180 / 4}
                                height={258 / 4}
                                priority={true}
                            />
                        </div>
                        <h1 className={styles.title}>Event Registration</h1>
                        <p className={styles.subtitle}>
                            Please fill out the form below to register for the
                            retreat.
                        </p>
                    </div>

                    {searchParams.success && (
                        <div className={styles.successMessage}>
                            Registration successful! Thank you for registering.
                        </div>
                    )}
                    {searchParams.error && (
                        <div className={styles.errorMessage}>
                            Registration failed. Please try again.
                        </div>
                    )}

                    <RegistrationForm questions={questions} error={error} />
                </div>
            </div>
        </div>
    )
}

export default UI
