'use client'

import { useState } from 'react'
import styles from '../register/register.module.scss'
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import CountrySelect from './CountrySelect'
import Logo from '@/components/Logo'

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
    c_6716245: string // emergency_contact_phone
    c_6716246: string // dietary_restrictions
    c_6716271: string // jacket_size
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
        c_6716245: '', // emergency_contact_phone
        c_6716246: '', // dietary_restrictions
        c_6716271: '', // jacket_size
    })

    const handleInputChange = (
        field: keyof FormData,
        value: string | File | null,
        subfield?: keyof FormData['work_address_id'] | null
    ) => {
        if (subfield) {
            setFormData((prev) => ({
                ...prev,
                work_address_id: {
                    ...prev.work_address_id,
                    [subfield]: value as string,
                },
            }))
            return
        }

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

    const renderStage1 = () => (
        <div className={styles.inputGroup}>
            {/* Email Address */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="email"
                    id="registrant-email"
                    name="Registrant[email]"
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    aria-describedby="error-registrant-email"
                    autoComplete="email"
                />
            </div>

            {/* Registrant Type */}
            {/* <FormControl
                fullWidth
                className={styles.formField}
                data-hidden={true}
            >
                <InputLabel>Select a registrant type *</InputLabel>
                <Select
                    name="Registrant[reg_type_id]"
                    label="Select a registrant type"
                    required
                    value={formData.reg_type_id}
                    onChange={(e) =>
                        handleInputChange('reg_type_id', e.target.value)
                    }
                >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="958373">Attendee</MenuItem>
                </Select>
            </FormControl> */}

            {/* Prefix */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-prefix"
                    name="Registrant[prefix]"
                    label="Prefix (Mr., Mrs., etc.)"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.prefix}
                    onChange={(e) =>
                        handleInputChange('prefix', e.target.value)
                    }
                    aria-describedby="error-registrant-prefix"
                    autoComplete="honorific-prefix"
                />
            </div>

            {/* First Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-first_name"
                    name="Registrant[first_name]"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.first_name}
                    onChange={(e) =>
                        handleInputChange('first_name', e.target.value)
                    }
                    aria-describedby="error-registrant-first_name"
                    autoComplete="given-name"
                />
            </div>

            {/* Middle Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-middle_name"
                    name="Registrant[middle_name]"
                    label="Middle Name"
                    variant="outlined"
                    fullWidth
                    value={formData.middle_name}
                    onChange={(e) =>
                        handleInputChange('middle_name', e.target.value)
                    }
                    aria-describedby="error-registrant-middle_name"
                    autoComplete="additional-name"
                />
            </div>

            {/* Last Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-last_name"
                    name="Registrant[last_name]"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.last_name}
                    onChange={(e) =>
                        handleInputChange('last_name', e.target.value)
                    }
                    aria-describedby="error-registrant-last_name"
                    autoComplete="family-name"
                />
            </div>

            {/* Title */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716230"
                    name="Registrant[c_6716230]"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    aria-describedby="error-registrant-c_6716230"
                />
            </div>

            {/* Organization */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716228"
                    name="Registrant[c_6716228]"
                    label="Organization"
                    variant="outlined"
                    fullWidth
                    value={formData.organization}
                    onChange={(e) =>
                        handleInputChange('organization', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716228"
                />
            </div>

            {/* Office Phone */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="tel"
                    id="registrant-c_6716229"
                    name="Registrant[c_6716229]"
                    label="Office Phone"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716229}
                    onChange={(e) =>
                        handleInputChange('c_6716229', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716229"
                />
            </div>

            {/* Mobile Phone */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="tel"
                    id="registrant-mobile_phone"
                    name="Registrant[mobile_phone]"
                    label="Mobile Phone"
                    variant="outlined"
                    fullWidth
                    value={formData.mobile_phone}
                    onChange={(e) =>
                        handleInputChange('mobile_phone', e.target.value)
                    }
                    aria-describedby="error-registrant-mobile_phone"
                />
            </div>

            {/* Address Line 1 */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="address-registrant-work_address_id-line_1"
                    name="Address[Registrant][work_address_id][line_1]"
                    placeholder="Address Line 1"
                    fullWidth
                    label="Address Line 1"
                    value={formData.work_address_id.line_1}
                    onChange={(e) =>
                        handleInputChange(
                            'work_address_id',
                            e.target.value,
                            'line_1'
                        )
                    }
                    aria-describedby="error-address-registrant-work_address_id-line_1"
                    autoComplete="true"
                />
            </div>

            {/* Address Line 2 */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="address-registrant-work_address_id-line_2"
                    name="Address[Registrant][work_address_id][line_2]"
                    placeholder="Address Line 2"
                    label="Address Line 2"
                    fullWidth
                    value={formData.work_address_id.line_2}
                    onChange={(e) =>
                        handleInputChange(
                            'work_address_id',
                            e.target.value,
                            'line_2'
                        )
                    }
                    aria-describedby="error-address-registrant-work_address_id-line_2"
                    autoComplete="address-line2"
                />
            </div>

            {/* City */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="address-registrant-work_address_id-city"
                    name="Address[Registrant][work_address_id][city]"
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={formData.work_address_id.city}
                    onChange={(e) =>
                        handleInputChange(
                            'work_address_id',
                            e.target.value,
                            'city'
                        )
                    }
                    aria-describedby="error-address-registrant-work_address_id-city"
                    autoComplete="address-level2"
                />
            </div>

            {/* Country */}
            <CountrySelect
                value={formData.work_address_id.country_code}
                onChange={(value) =>
                    handleInputChange('work_address_id', value, 'country_code')
                }
                className={styles.formField}
            />

            {/* State */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="address-registrant-work_address_id-state"
                    name="Address[Registrant][work_address_id][state]"
                    label="State / Province / County"
                    variant="outlined"
                    fullWidth
                    value={formData.work_address_id.state}
                    onChange={(e) =>
                        handleInputChange(
                            'work_address_id',
                            e.target.value,
                            'state'
                        )
                    }
                    aria-describedby="error-address-registrant-work_address_id-state"
                />
            </div>

            {/* Zip/Postal Code */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="address-registrant-work_address_id-zip"
                    name="Address[Registrant][work_address_id][zip]"
                    label="Zip/Postal Code"
                    variant="outlined"
                    fullWidth
                    value={formData.work_address_id.zip}
                    onChange={(e) =>
                        handleInputChange(
                            'work_address_id',
                            e.target.value,
                            'zip'
                        )
                    }
                    aria-describedby="error-address-registrant-work_address_id-zip"
                    autoComplete="postal-code"
                />
            </div>

            {/* Profile Picture */}
            <div className={styles.inputWrapper}>
                <InputLabel
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                    }}
                >
                    Upload a Profile Picture
                </InputLabel>
                <input
                    className={styles.fileInput}
                    type="file"
                    id="registrant-profile_picture"
                    name="Registrant[profile_picture]"
                    accept="image/*"
                    onChange={(e) =>
                        handleInputChange(
                            'profile_picture',
                            e.target.files?.[0] || null
                        )
                    }
                    aria-describedby="error-registrant-profile_picture"
                    // style={{
                    //     width: '100%',
                    //     padding: '1rem 1.25rem',
                    //     fontSize: '1rem',
                    //     border: '2px solid rgba(0, 0, 0, 0.08)',
                    //     borderRadius: '12px',
                    //     background: 'rgba(248, 249, 250, 0.8)',
                    // }}
                />
            </div>
        </div>
    )

    const renderStage2 = () => (
        <div className={styles.inputGroup}>
            {/* Name for Credentials */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716240"
                    name="Registrant[c_6716240]"
                    label="Name for Credentials"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716240}
                    onChange={(e) =>
                        handleInputChange('c_6716240', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716240"
                />
                <div className={styles.hintBlock}>
                    Full name as you would like it to appear on credentials and
                    onsite materials.
                </div>
            </div>

            {/* Organization for Credentials */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716241"
                    name="Registrant[c_6716241]"
                    label="Organization for Credentials"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716241}
                    onChange={(e) =>
                        handleInputChange('c_6716241', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716241"
                />
                <div className={styles.hintBlock}>
                    Organization name as you would like it to appear on
                    credentials and onsite materials.
                </div>
            </div>

            {/* Emergency Contact Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716242"
                    name="Registrant[c_6716242]"
                    label="Emergency Contact Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716242}
                    onChange={(e) =>
                        handleInputChange('c_6716242', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716242"
                />
                <div className={styles.hintBlock}>
                    Please provide a contact in case of emergency while you are
                    with us in Kiawah.
                </div>
            </div>

            {/* Emergency Contact Relation */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716243"
                    name="Registrant[c_6716243]"
                    label="Emergency Contact Relation"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716243}
                    onChange={(e) =>
                        handleInputChange('c_6716243', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716243"
                />
            </div>

            {/* Emergency Contact Email */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="email"
                    id="registrant-c_6716244"
                    name="Registrant[c_6716244]"
                    label="Emergency Contact Email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716244}
                    onChange={(e) =>
                        handleInputChange('c_6716244', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716244"
                />
            </div>

            {/* Emergency Contact Phone */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="tel"
                    id="registrant-c_6716246"
                    name="Registrant[c_6716246]"
                    label="Emergency Contact Phone"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716246}
                    onChange={(e) =>
                        handleInputChange('c_6716246', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716246"
                />
            </div>

            {/* Dietary Restrictions */}
            <div className={styles.inputWrapper}>
                <textarea
                    id="registrant-c_6716247"
                    name="Registrant[c_6716247]"
                    placeholder="Dietary Restrictions or Allergies"
                    className={styles.textareaInput}
                    value={formData.c_6716247}
                    onChange={(e) =>
                        handleInputChange('c_6716247', e.target.value)
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
                    value={formData.c_6716271}
                    onChange={(e) =>
                        handleInputChange('c_6716271', e.target.value)
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
                            <Logo $logoType="default" />
                        </div>
                        <h1 className={styles.title}>
                            You&apos;re invited to the retreat hosted by George
                            Pyne and Jay Penske
                        </h1>
                        <p>March 18-20, 2026</p>
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
