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
    id: string
    type: string
    question: string
    required: boolean
    options?: Array<{
        id: string
        value: string
        text: string
        sort_order?: number
    }>
    field_name?: string
    attribute?: string
    name?: string
    validation?: any
    description?: string
    [key: string]: any
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
        const {
            id,
            type,
            question: label,
            required,
            options,
            field_name,
            attribute,
            name,
        } = question

        // Use field_name or attribute as the field identifier
        const fieldName = field_name || attribute || name || `field_${id}`
        const fieldLabel = label || name || `Question ${id}`

        // Skip certain fields that shouldn't be shown in the form
        if (
            fieldName === 'password' ||
            fieldName === 'vat_number' ||
            fieldName === 'reg_type_id' ||
            fieldName?.startsWith('h_') ||
            fieldName?.startsWith('sq_')
        ) {
            return null
        }

        // Handle different field types based on the detailed question data
        switch (type?.toLowerCase()) {
            case 'select':
            case 'dropdown':
                return (
                    <FormControl
                        key={id}
                        fullWidth
                        className={styles.formField}
                    >
                        <InputLabel>
                            {fieldLabel} {required && '*'}
                        </InputLabel>
                        <Select
                            name={fieldName}
                            label={`${fieldLabel} ${required ? '*' : ''}`}
                            required={required}
                        >
                            <MenuItem value="">Select {fieldLabel}</MenuItem>
                            {options?.map((option) => (
                                <MenuItem
                                    key={option.id || option.value}
                                    value={option.value}
                                >
                                    {option.text || option.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )

            case 'radioList':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                            }}
                        >
                            {fieldLabel} {required && '*'}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            {options?.map((option) => (
                                <label
                                    key={option.id || option.value}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={fieldName}
                                        value={option.value}
                                        required={required}
                                    />
                                    {option.text || option.value}
                                </label>
                            ))}
                        </div>
                    </div>
                )

            case 'checkboxList':
                if (options && options.length > 1) {
                    return (
                        <div key={id} className={styles.inputWrapper}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                }}
                            >
                                {fieldLabel} {required && '*'}
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                }}
                            >
                                {options.map((option) => (
                                    <label
                                        key={option.id || option.value}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            name={`${fieldName}[]`}
                                            value={option.value}
                                        />
                                        {option.text || option.value}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={id} className={styles.inputWrapper}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name={fieldName}
                                    required={required}
                                />
                                {fieldLabel} {required && '*'}
                            </label>
                        </div>
                    )
                }

            case 'textarea':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <textarea
                            name={fieldName}
                            placeholder={fieldLabel}
                            required={required}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                fontSize: '1rem',
                                border: '2px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: '12px',
                                background: 'rgba(248, 249, 250, 0.8)',
                                transition:
                                    'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                            }}
                        />
                        <span className={styles.bar} />
                    </div>
                )

            case 'file':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                            }}
                        >
                            {fieldLabel} {required && '*'}
                        </label>
                        <input
                            type="file"
                            name={fieldName}
                            required={required}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                fontSize: '1rem',
                                border: '2px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: '12px',
                                background: 'rgba(248, 249, 250, 0.8)',
                            }}
                        />
                    </div>
                )

            case 'date':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <Input
                            name={fieldName}
                            type="date"
                            placeholder={fieldLabel}
                            fullWidth
                            required={required}
                        />
                        <span className={styles.bar} />
                    </div>
                )

            case 'email':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <Input
                            name={fieldName}
                            type="email"
                            placeholder={fieldLabel}
                            fullWidth
                            required={required}
                            autoComplete="email"
                        />
                        <span className={styles.bar} />
                    </div>
                )

            case 'phone':
            case 'tel':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <Input
                            name={fieldName}
                            type="tel"
                            placeholder={fieldLabel}
                            fullWidth
                            required={required}
                            autoComplete="tel"
                        />
                        <span className={styles.bar} />
                    </div>
                )

            case 'number':
                return (
                    <div key={id} className={styles.inputWrapper}>
                        <Input
                            name={fieldName}
                            type="number"
                            placeholder={fieldLabel}
                            fullWidth
                            required={required}
                        />
                        <span className={styles.bar} />
                    </div>
                )

            case 'text':
            default:
                // Determine input type based on field name for fallback
                let inputType = 'text'
                if (fieldName?.includes('email')) {
                    inputType = 'email'
                } else if (fieldName?.includes('phone')) {
                    inputType = 'tel'
                }

                return (
                    <div key={id} className={styles.inputWrapper}>
                        <Input
                            name={fieldName}
                            type={inputType}
                            placeholder={fieldLabel}
                            fullWidth
                            required={required}
                            autoComplete={
                                inputType === 'email'
                                    ? 'email'
                                    : inputType === 'tel'
                                    ? 'tel'
                                    : 'on'
                            }
                        />
                        <span className={styles.bar} />
                    </div>
                )
        }
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
