'use client'

import { useState } from 'react'
import styles from '../register/register.module.scss'
import Image from 'next/image'
import {
    Button,
    Input,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'

interface FormData {
    email: string
    reg_type_id: string
    prefix: string
    first_name: string
    middle_name: string
    last_name: string
    title: string
    organization: string
    office_phone: string
    mobile_phone: string
    country_code: string
    address_line_1: string
    address_line_2: string
    city: string
    state: string
    zip: string
    profile_picture: File | null
    name_for_credentials: string
    organization_for_credentials: string
    emergency_contact_name: string
    emergency_contact_relation: string
    emergency_contact_email: string
    emergency_contact_phone: string
    dietary_restrictions: string
    jacket_size: string
}

const HardcodedRegistrationForm = () => {
    const [currentStage, setCurrentStage] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        email: '',
        reg_type_id: '',
        prefix: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        title: '',
        organization: '',
        office_phone: '',
        mobile_phone: '',
        country_code: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
        profile_picture: null,
        name_for_credentials: '',
        organization_for_credentials: '',
        emergency_contact_name: '',
        emergency_contact_relation: '',
        emergency_contact_email: '',
        emergency_contact_phone: '',
        dietary_restrictions: '',
        jacket_size: '',
    })

    const handleInputChange = (
        field: keyof FormData,
        value: string | File | null
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleNextStage = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentStage === 1) {
            setCurrentStage(2)
        }
    }

    const handlePreviousStage = () => {
        setCurrentStage(1)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // TODO: Submit to API
    }

    const renderStage1 = () => <></>

    const renderStage2 = () => (
        <div className={styles.inputGroup}>
            {/* Name for Credentials */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-c_6716240"
                    name="Registrant[c_6716240]"
                    placeholder="Name for Credentials *"
                    fullWidth
                    required
                    value={formData.name_for_credentials}
                    onChange={(e) =>
                        handleInputChange(
                            'name_for_credentials',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716240"
                />
                <span className={styles.bar} />
                <div className={styles.hintBlock}>
                    Full name as you would like it to appear on credentials and
                    onsite materials.
                </div>
            </div>

            {/* Organization for Credentials */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-c_6716241"
                    name="Registrant[c_6716241]"
                    placeholder="Organization for Credentials *"
                    fullWidth
                    required
                    value={formData.organization_for_credentials}
                    onChange={(e) =>
                        handleInputChange(
                            'organization_for_credentials',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716241"
                />
                <span className={styles.bar} />
                <div className={styles.hintBlock}>
                    Organization name as you would like it to appear on
                    credentials and onsite materials.
                </div>
            </div>

            {/* Emergency Contact Name */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-c_6716242"
                    name="Registrant[c_6716242]"
                    placeholder="Emergency Contact Name *"
                    fullWidth
                    required
                    value={formData.emergency_contact_name}
                    onChange={(e) =>
                        handleInputChange(
                            'emergency_contact_name',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716242"
                />
                <span className={styles.bar} />
                <div className={styles.hintBlock}>
                    Please provide a contact in case of emergency while you are
                    with us in Kiawah.
                </div>
            </div>

            {/* Emergency Contact Relation */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-c_6716243"
                    name="Registrant[c_6716243]"
                    placeholder="Emergency Contact Relation *"
                    fullWidth
                    required
                    value={formData.emergency_contact_relation}
                    onChange={(e) =>
                        handleInputChange(
                            'emergency_contact_relation',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716243"
                />
                <span className={styles.bar} />
            </div>

            {/* Emergency Contact Email */}
            <div className={styles.inputWrapper}>
                <Input
                    type="email"
                    id="registrant-c_6716244"
                    name="Registrant[c_6716244]"
                    placeholder="Emergency Contact Email *"
                    fullWidth
                    required
                    value={formData.emergency_contact_email}
                    onChange={(e) =>
                        handleInputChange(
                            'emergency_contact_email',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716244"
                />
                <span className={styles.bar} />
            </div>

            {/* Emergency Contact Phone */}
            <div className={styles.inputWrapper}>
                <Input
                    type="tel"
                    id="registrant-c_6716246"
                    name="Registrant[c_6716246]"
                    placeholder="Emergency Contact Phone *"
                    fullWidth
                    required
                    value={formData.emergency_contact_phone}
                    onChange={(e) =>
                        handleInputChange(
                            'emergency_contact_phone',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716246"
                />
                <span className={styles.bar} />
            </div>

            {/* Dietary Restrictions */}
            <div className={styles.inputWrapper}>
                <textarea
                    id="registrant-c_6716247"
                    name="Registrant[c_6716247]"
                    placeholder="Dietary Restrictions or Allergies"
                    className={styles.textareaInput}
                    value={formData.dietary_restrictions}
                    onChange={(e) =>
                        handleInputChange(
                            'dietary_restrictions',
                            e.target.value
                        )
                    }
                    aria-describedby="error-registrant-c_6716247"
                />
            </div>

            {/* Jacket Size */}
            <FormControl fullWidth className={styles.formField}>
                <InputLabel>What is your jacket size?</InputLabel>
                <Select
                    name="Registrant[c_6716271]"
                    label="What is your jacket size?"
                    value={formData.jacket_size}
                    onChange={(e) =>
                        handleInputChange('jacket_size', e.target.value)
                    }
                >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="38978942">X Small</MenuItem>
                    <MenuItem value="38978939">Small</MenuItem>
                    <MenuItem value="38978940">Medium</MenuItem>
                    <MenuItem value="38978941">Large</MenuItem>
                    <MenuItem value="38978943">X Large</MenuItem>
                    <MenuItem value="38978944">XX Large</MenuItem>
                </Select>
            </FormControl>
        </div>
    )

    return (
        <form
            className={styles.form}
            onSubmit={currentStage === 1 ? handleNextStage : handleSubmit}
        >
            {currentStage === 1 ? renderStage1() : renderStage2()}

            <div className={styles.buttonGroup}>
                {currentStage === 2 && (
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handlePreviousStage}
                        className={styles.backButton}
                    >
                        Back
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submitButton}
                >
                    {currentStage === 1 ? 'Next' : 'Register'}
                </Button>
            </div>
        </form>
    )
}

const UI = () => {
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

                    <HardcodedRegistrationForm />
                </div>
            </div>
        </div>
    )
}

export default UI
