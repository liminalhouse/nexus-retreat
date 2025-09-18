'use client'

import { useState } from 'react'
import styles from '../register/register.module.scss'
import {
    Button,
    Box,
    Typography,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import Logo from '@/components/Logo'
import { formConfig, getFieldByFormDataKey } from './formConfig'
import FieldRenderer from './FieldRenderer'
import CountrySelect from './CountrySelect'

interface FormData {
    email: string
    reg_type_id: string
    prefix: string
    first_name: string
    middle_name: string
    last_name: string
    title: string
    organization: string
    c_6716229: string // office_phone
    work_address_id: {
        line_1: string
        line_2: string
        city: string
        state: string
        zip: string
        country_code: string
    }
    mobile_phone: string
    profile_picture?: any | undefined
    c_6716240: string // name_for_credentials
    c_6716241: string // organization_for_credentials
    c_6716242: string // emergency_contact_name
    c_6716243: string // emergency_contact_relation
    c_6716244: string // emergency_contact_email
    c_6716246: string // emergency_contact_phone
    c_6716271: string // jacket_size
    c_6716247: string // dietary_restrictions_details
    c_6716225: string // point_of_contact_name
    c_6716226: string // point_of_contact_title
    c_6716267: string[] // complimentary_accommodations
    c_6716231: string // point_of_contact_email
    c_6716269: string[] // dinner_attendance
    c_6716232: string // point_of_contact_phone
    c_6716234: string // secondary_point_of_contact_name
    c_6716236: string // secondary_point_of_contact_email
    c_6832581: string // guest_name
    c_6716237: string // secondary_point_of_contact_phone
    c_6716248: string // guest_relation
    c_6716263: string // guest_email
    c_6838231: string[] // activities
}

interface HardcodedRegistrationFormProps {
    currentStage: number
    setCurrentStage: (stage: number) => void
}

const HardcodedRegistrationForm: React.FC<HardcodedRegistrationFormProps> = ({
    currentStage,
    setCurrentStage,
}) => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        reg_type_id: '',
        prefix: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        title: '',
        organization: '',
        c_6716229: '', // office_phone
        work_address_id: {
            line_1: '',
            line_2: '',
            city: '',
            state: '',
            zip: '',
            country_code: '',
        },
        mobile_phone: '',
        profile_picture: undefined,
        c_6716240: '', // name_for_credentials
        c_6716241: '', // organization_for_credentials
        c_6716242: '', // emergency_contact_name
        c_6716243: '', // emergency_contact_relation
        c_6716244: '', // emergency_contact_email
        c_6716246: '', // emergency_contact_phone
        c_6716271: '', // jacket_size
        c_6716247: '', // dietary_restrictions_details
        c_6716225: '', // point_of_contact_name
        c_6716226: '', // point_of_contact_title
        c_6716267: [], // complimentary_accommodations
        c_6716231: '', // point_of_contact_email
        c_6716269: [], // dinner_attendance
        c_6716232: '', // point_of_contact_phone
        c_6716234: '', // secondary_point_of_contact_name
        c_6716236: '', // secondary_point_of_contact_email
        c_6832581: '', // guest_name
        c_6716237: '', // secondary_point_of_contact_phone
        c_6716248: '', // guest_relation
        c_6716263: '', // guest_email
        c_6838231: [], // activities
    })

    const handleInputChange = (
        fieldName: string,
        value: any,
        subfield?: string
    ) => {
        if (subfield) {
            setFormData((prev) => ({
                ...prev,
                work_address_id: {
                    ...prev.work_address_id,
                    [subfield]: value,
                },
            }))
            return
        }

        // Extract key from fieldName like "Registrant[email]" -> "email"
        const keyMatch = fieldName.match(/\[([^\]]+)\]/)
        if (keyMatch) {
            const key = keyMatch[1]
            setFormData((prev) => ({
                ...prev,
                [key]: value,
            }))
        }
    }

    const handleCheckboxChange = (
        fieldName: string,
        value: string,
        checked: boolean
    ) => {
        // Extract key from fieldName like "Registrant[c_6716267]" -> "c_6716267"
        const keyMatch = fieldName.match(/\[([^\]]+)\]/)
        if (keyMatch) {
            const key = keyMatch[1]
            setFormData((prev) => {
                const currentArray = prev[key as keyof FormData] as string[]
                const newArray = checked
                    ? [...currentArray, value]
                    : currentArray.filter((item) => item !== value)

                return {
                    ...prev,
                    [key]: newArray,
                }
            })
        }
    }

    const handleNextStage = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentStage === 1) {
            setCurrentStage(2)
        } else if (currentStage === 2) {
            setCurrentStage(3)
        }
    }

    const handlePreviousStage = () => {
        if (currentStage === 3) {
            setCurrentStage(2)
        } else if (currentStage === 2) {
            setCurrentStage(1)
        }
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
        {}
    )

    // Validation functions using centralized form config
    const validateEmail = (email: string): string | null => {
        if (!email) return null
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
            ? null
            : 'Please enter a valid email address'
    }

    const validatePhone = (phone: string): string | null => {
        if (!phone) return null
        const digits = phone.replace(/\D/g, '')
        if (digits.length < 10) return 'Phone number must be at least 10 digits'
        if (digits.length > 15)
            return 'Phone number must be less than 15 digits'
        return null
    }

    const validateRequired = (
        value: string,
        fieldLabel: string
    ): string | null => {
        if (!value || value.trim() === '') {
            return `${fieldLabel} is required`
        }
        return null
    }

    // Field validation using form config
    const validateField = (fieldName: string, value: any): string | null => {
        // Extract form data key from field name
        const key = fieldName.match(/\[([^\]]+)\]$/)?.[1] || fieldName

        // Get field config
        const field = getFieldByFormDataKey(key)
        if (!field) return null

        // Check required validation first
        if (field.required) {
            const requiredError = validateRequired(value, field.label)
            if (requiredError) return requiredError
        }

        // Skip further validation if field is empty and not required
        if (!value || value === '') return null

        // Apply specific validation based on field type
        if (field.validationType === 'email') {
            return validateEmail(value)
        }

        if (field.validationType === 'phone') {
            return validatePhone(value)
        }

        return null
    }

    const handleFieldBlur = (fieldName: string, value: any) => {
        const error = validateField(fieldName, value)

        // Extract form data key from field name
        const key = fieldName.match(/\[([^\]]+)\]$/)?.[1] || fieldName

        setFieldErrors((prev) => ({
            ...prev,
            [key]: error || '',
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            console.log('Submitting form data:', formData)

            // Get event ID from environment or use a default
            const eventId = process.env.NEXT_PUBLIC_SWOOGO_EVENT_ID || ''

            if (!eventId) {
                throw new Error('Event ID not configured')
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_id: eventId,
                    ...formData,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed')
            }

            console.log('Registration successful:', result)
            setSubmitSuccess(true)

            // Optionally redirect or show success message
            // router.push('/registration-success')
        } catch (error) {
            console.error('Registration error:', error)
            setSubmitError(
                error instanceof Error ? error.message : 'Registration failed'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function to get form field values
    const getFieldValue = (fieldName: string): any => {
        // Extract key from fieldName like "Registrant[email]" -> "email"
        const keyMatch = fieldName.match(/\[([^\]]+)\]/)
        if (keyMatch) {
            const key = keyMatch[1]
            return formData[key as keyof FormData] || ''
        }
        return ''
    }

    const renderStage = (stageIndex: number) => {
        const stage = formConfig[stageIndex]
        if (!stage) return null

        return (
            <div className={styles.inputGroup}>
                {stage.fields.map((field) => (
                    <FieldRenderer
                        key={field.id}
                        field={field}
                        value={getFieldValue(field.name)}
                        onChange={handleInputChange}
                        onCheckboxChange={handleCheckboxChange}
                        onBlur={handleFieldBlur}
                        error={
                            field.formDataKey
                                ? fieldErrors[field.formDataKey]
                                : undefined
                        }
                        formData={formData}
                    />
                ))}
            </div>
        )
    }

    return (
        <form
            className={styles.form}
            onSubmit={currentStage === 3 ? handleSubmit : handleNextStage}
        >
            {renderStage(currentStage - 1)}

            {/* Error and Success Messages */}
            {submitError && (
                <Box
                    mb={2}
                    p={2}
                    sx={{ backgroundColor: '#ffebee', borderRadius: 1 }}
                >
                    <Typography color="error" variant="body2">
                        {submitError}
                    </Typography>
                </Box>
            )}

            {submitSuccess && (
                <Box
                    mb={2}
                    p={2}
                    sx={{ backgroundColor: '#e8f5e8', borderRadius: 1 }}
                >
                    <Typography color="success.main" variant="body2">
                        Registration successful! You will receive a confirmation
                        email shortly.
                    </Typography>
                </Box>
            )}

            <div className={styles.buttonGroup}>
                {(currentStage === 2 || currentStage === 3) && (
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handlePreviousStage}
                        className={styles.backButton}
                        disabled={isSubmitting}
                    >
                        Back
                    </Button>
                )}
                {currentStage < 3 && (
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleNextStage}
                        className={styles.nextButton}
                        disabled={isSubmitting}
                    >
                        Next
                    </Button>
                )}
                {currentStage === 3 && (
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles.submitButton}
                        disabled={isSubmitting || submitSuccess}
                    >
                        {isSubmitting
                            ? 'Registering...'
                            : submitSuccess
                            ? 'Registered!'
                            : 'Register'}
                    </Button>
                )}
            </div>
        </form>
    )
}

const UI = () => {
    const [currentStage, setCurrentStage] = useState(1)

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <Button
                        href="/"
                        variant="outlined"
                        className={styles.homeButton}
                    >
                        &larr; Back to home
                    </Button>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <Logo $logoType="default" />
                        </div>
                        <h1 className={styles.title}>
                            Register for the Retreat
                        </h1>
                        <p className={styles.subtitle}>March 18-20, 2026</p>
                    </div>

                    <Box mb={3}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                        >
                            <Typography variant="body2">
                                Progress: {Math.round((currentStage / 3) * 100)}
                                %
                            </Typography>
                            <Typography variant="body2">
                                {currentStage} / 3
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(currentStage / 3) * 100}
                        />
                    </Box>

                    {/* Step Stepper */}
                    <Stepper
                        activeStep={currentStage - 1}
                        alternativeLabel
                        style={{ marginBottom: '2rem' }}
                    >
                        {formConfig.map((stage, index) => (
                            <Step key={index}>
                                <StepLabel>{stage.title}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <HardcodedRegistrationForm
                        currentStage={currentStage}
                        setCurrentStage={setCurrentStage}
                    />
                </div>
            </div>
        </div>
    )
}

export default UI
