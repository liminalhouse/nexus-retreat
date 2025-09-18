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
} from '@mui/material'
import Logo from '@/components/Logo'
import { formConfig, FormField, getFieldByFormDataKey } from './formConfig'
import FieldRenderer from './FieldRenderer'

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

        // Validate current stage before proceeding
        const validation = validateStage(currentStage - 1) // Convert to 0-based index

        if (!validation.isValid) {
            // Set field errors to show validation messages
            setFieldErrors(validation.errors)
            setStageValidationError(
                `Please fix the errors above before proceeding to the next step.`
            )
            return // Don't proceed to next stage
        }

        // Clear any existing errors if validation passed
        setFieldErrors({})
        setStageValidationError(null)

        // Proceed to next stage
        if (currentStage === 1) {
            setCurrentStage(2)
        } else if (currentStage === 2) {
            setCurrentStage(3)
        }
    }

    const handlePreviousStage = () => {
        // Clear any stage validation errors when going back
        setStageValidationError(null)
        setFieldErrors({})

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
    const [stageValidationError, setStageValidationError] = useState<
        string | null
    >(null)
    const [registrationResult, setRegistrationResult] = useState<any>(null)

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

        // Handle file type validation differently
        if (field.type === 'file') {
            // File validation is mostly handled in the FieldRenderer
            // Here we validate if it's required and has valid data
            if (field.required && (!value || value === '')) {
                return `${field.label} is required`
            }
            // If we have a value, it should be a base64 string
            if (value && typeof value === 'string' && !value.startsWith('data:')) {
                return `${field.label} must be a valid file`
            }
            return null
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

    // Helper function to get all fields from a stage (including nested fields)
    const getAllFieldsFromStage = (stageIndex: number): FormField[] => {
        const stage = formConfig[stageIndex]
        if (!stage) return []

        const allFields: FormField[] = []

        const extractFields = (fields: FormField[]) => {
            fields.forEach((field) => {
                if (field.type === 'fieldset' || field.type === 'group') {
                    if (field.fields) {
                        extractFields(field.fields)
                    }
                } else {
                    allFields.push(field)
                }
            })
        }

        extractFields(stage.fields)
        return allFields
    }

    // Render confirmation stage
    const renderConfirmationStage = () => {
        return (
            <div className={styles.confirmationStage}>
                <Box textAlign="center" py={4}>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                        Thank you for registering for the retreat!
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ mt: 2, mx: 'auto', maxWidth: '80%' }}
                    >
                        We look forward to seeing you at The Boca Raton from
                        March 18-20, 2026. Stay tuned for programming and
                        logistical updates as we near the event.
                        <br />
                        <br />
                        For any questions, please contact Virginia Slattery at{' '}
                        <a href="mailto:vslattery@globalsportsleaders.com">
                            vslattery@globalsportsleaders.com
                        </a>{' '}
                        and <a href="tel:+19178031481">+1 917-803-1481</a>.
                    </Typography>

                    {registrationResult && (
                        <Box
                            sx={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                borderRadius: 2,
                                p: 3,
                                mt: 3,
                                textAlign: 'left',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Registration Details:
                            </Typography>
                            <Typography variant="body2" component="div">
                                <strong>Name:</strong> {formData.first_name}{' '}
                                {formData.last_name}
                            </Typography>
                            <Typography variant="body2" component="div">
                                <strong>Email:</strong> {formData.email}
                            </Typography>
                            {registrationResult.registrant?.id && (
                                <Typography variant="body2" component="div">
                                    <strong>Registration ID:</strong>{' '}
                                    {registrationResult.registrant.id}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </div>
        )
    }

    // Validate all fields in a specific stage
    const validateStage = (
        stageIndex: number
    ): { isValid: boolean; errors: { [key: string]: string } } => {
        const stageFields = getAllFieldsFromStage(stageIndex)
        const errors: { [key: string]: string } = {}
        let isValid = true

        stageFields.forEach((field) => {
            if (!field.formDataKey) return

            let value: any

            // Handle work address fields
            if (field.formDataKey.startsWith('work_address_id.')) {
                const addressField = field.formDataKey.replace(
                    'work_address_id.',
                    ''
                )
                value =
                    formData.work_address_id[
                        addressField as keyof typeof formData.work_address_id
                    ]
            } else {
                value = formData[field.formDataKey as keyof FormData]
            }

            const fieldError = validateField(field.name, value)
            if (fieldError) {
                errors[field.formDataKey] = fieldError
                isValid = false
            }
        })

        return { isValid, errors }
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

            setSubmitSuccess(true)
            setRegistrationResult(result)

            // Navigate to confirmation stage
            setCurrentStage(4)
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
        // Handle confirmation stage (stage 4, index 3)
        if (stageIndex === 3 || currentStage === 4) {
            return renderConfirmationStage()
        }

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
                        fieldErrors={fieldErrors}
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
            {stageValidationError && (
                <Box
                    mb={2}
                    p={2}
                    sx={{
                        backgroundColor: `secondary.light`,
                        borderRadius: 1,
                        border: `1px solid`,
                        borderColor: 'secondary.main',
                    }}
                >
                    <Typography color="secondary.dark" variant="body2">
                        {stageValidationError}
                    </Typography>
                </Box>
            )}

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

            {currentStage <= 3 && (
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
            )}
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
                        {currentStage <= 3 && (
                            <>
                                <h1 className={styles.title}>
                                    Register for the Retreat
                                </h1>
                                <p className={styles.subtitle}>
                                    March 18-20, 2026
                                </p>
                            </>
                        )}
                    </div>

                    {currentStage <= 3 && (
                        <Box mb={3}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                            >
                                <Typography variant="body2">
                                    Progress:{' '}
                                    {Math.round((currentStage / 3) * 100)}%
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
                    )}

                    {/* Step Stepper */}
                    {currentStage <= 3 && (
                        <Stepper
                            activeStep={currentStage - 1}
                            alternativeLabel
                            style={{ marginBottom: '2rem', width: '100%' }}
                        >
                            {formConfig.map((stage, index) => (
                                <Step key={index}>
                                    <StepLabel>{stage.title}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )}

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
