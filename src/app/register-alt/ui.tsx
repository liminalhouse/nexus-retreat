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
import { formConfig } from './formConfig'
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
    profile_picture: File | null
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
    c_6716239: string // guest_email
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
        profile_picture: null,
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
        c_6716239: '', // guest_email
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

        // Map field names to FormData keys
        const fieldMapping: { [key: string]: keyof FormData } = {
            'Registrant[email]': 'email',
            'Registrant[prefix]': 'prefix',
            'Registrant[first_name]': 'first_name',
            'Registrant[middle_name]': 'middle_name',
            'Registrant[last_name]': 'last_name',
            'Registrant[c_6716230]': 'title',
            'Registrant[c_6716228]': 'organization',
            'Registrant[c_6716229]': 'c_6716229',
            'Registrant[mobile_phone]': 'mobile_phone',
            'Registrant[profile_picture]': 'profile_picture',
            'Registrant[c_6716240]': 'c_6716240',
            'Registrant[c_6716241]': 'c_6716241',
            'Registrant[c_6716242]': 'c_6716242',
            'Registrant[c_6716243]': 'c_6716243',
            'Registrant[c_6716244]': 'c_6716244',
            'Registrant[c_6716246]': 'c_6716246',
            'Registrant[c_6716247]': 'c_6716247',
            'Registrant[c_6716271]': 'c_6716271',
            'Registrant[c_6716225]': 'c_6716225',
            'Registrant[c_6716226]': 'c_6716226',
            'Registrant[c_6716231]': 'c_6716231',
            'Registrant[c_6716232]': 'c_6716232',
            'Registrant[c_6716234]': 'c_6716234',
            'Registrant[c_6716236]': 'c_6716236',
            'Registrant[c_6832581]': 'c_6832581',
            'Registrant[c_6716237]': 'c_6716237',
            'Registrant[c_6716248]': 'c_6716248',
            'Registrant[c_6716239]': 'c_6716239',
        }

        const mappedField = fieldMapping[fieldName]
        if (mappedField) {
            setFormData((prev) => ({
                ...prev,
                [mappedField]: value,
            }))
        }
    }

    const handleCheckboxChange = (
        fieldName: string,
        value: string,
        checked: boolean
    ) => {
        // Map field names to FormData keys for checkbox groups
        const checkboxFieldMapping: { [key: string]: keyof FormData } = {
            'Registrant[c_6716267]': 'c_6716267',
            'Registrant[c_6716269]': 'c_6716269',
            'Registrant[c_6838231]': 'c_6838231',
        }

        const mappedField = checkboxFieldMapping[fieldName]
        if (mappedField) {
            setFormData((prev) => {
                const currentArray = prev[mappedField] as string[]
                const newArray = checked
                    ? [...currentArray, value]
                    : currentArray.filter((item) => item !== value)

                return {
                    ...prev,
                    [mappedField]: newArray,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // TODO: Submit to API
    }

    // Helper function to get form field values
    const getFieldValue = (fieldName: string): any => {
        const fieldMapping: { [key: string]: any } = {
            'Registrant[email]': formData.email,
            'Registrant[prefix]': formData.prefix,
            'Registrant[first_name]': formData.first_name,
            'Registrant[middle_name]': formData.middle_name,
            'Registrant[last_name]': formData.last_name,
            'Registrant[c_6716230]': formData.title,
            'Registrant[c_6716228]': formData.organization,
            'Registrant[c_6716229]': formData.c_6716229,
            'Registrant[mobile_phone]': formData.mobile_phone,
            'Registrant[profile_picture]': formData.profile_picture,
            'Registrant[c_6716240]': formData.c_6716240,
            'Registrant[c_6716241]': formData.c_6716241,
            'Registrant[c_6716242]': formData.c_6716242,
            'Registrant[c_6716243]': formData.c_6716243,
            'Registrant[c_6716244]': formData.c_6716244,
            'Registrant[c_6716246]': formData.c_6716246,
            'Registrant[c_6716247]': formData.c_6716247,
            'Registrant[c_6716271]': formData.c_6716271,
            'Registrant[c_6716225]': formData.c_6716225,
            'Registrant[c_6716226]': formData.c_6716226,
            'Registrant[c_6716231]': formData.c_6716231,
            'Registrant[c_6716232]': formData.c_6716232,
            'Registrant[c_6716234]': formData.c_6716234,
            'Registrant[c_6716236]': formData.c_6716236,
            'Registrant[c_6832581]': formData.c_6832581,
            'Registrant[c_6716237]': formData.c_6716237,
            'Registrant[c_6716248]': formData.c_6716248,
            'Registrant[c_6716239]': formData.c_6716239,
            'Registrant[c_6716267]': formData.c_6716267,
            'Registrant[c_6716269]': formData.c_6716269,
            'Registrant[c_6838231]': formData.c_6838231,
        }
        return fieldMapping[fieldName] || ''
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

            <div className={styles.buttonGroup}>
                {(currentStage === 2 || currentStage === 3) && (
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handlePreviousStage}
                        className={styles.backButton}
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
                    >
                        Register
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
