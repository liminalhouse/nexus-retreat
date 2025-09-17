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

    const renderStage1 = () => (
        <div className={styles.inputGroup}>
            {/* Email Address */}
            <div className={styles.inputWrapper}>
                <Input
                    type="email"
                    id="registrant-email"
                    name="Registrant[email]"
                    placeholder="Email Address *"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    aria-describedby="error-registrant-email"
                    autoComplete="email"
                />
                <span className={styles.bar} />
            </div>

            {/* Registrant Type */}
            <FormControl fullWidth className={styles.formField}>
                <InputLabel>Select a registrant type *</InputLabel>
                <Select
                    name="Registrant[reg_type_id]"
                    label="Select a registrant type *"
                    required
                    value={formData.reg_type_id}
                    onChange={(e) =>
                        handleInputChange('reg_type_id', e.target.value)
                    }
                >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="958373">Attendee</MenuItem>
                </Select>
            </FormControl>

            {/* Prefix */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-prefix"
                    name="Registrant[prefix]"
                    placeholder="Prefix (Mr., Mrs., etc.) *"
                    fullWidth
                    required
                    value={formData.prefix}
                    onChange={(e) =>
                        handleInputChange('prefix', e.target.value)
                    }
                    aria-describedby="error-registrant-prefix"
                    autoComplete="honorific-prefix"
                />
                <span className={styles.bar} />
            </div>

            {/* First Name */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-first_name"
                    name="Registrant[first_name]"
                    placeholder="First Name *"
                    fullWidth
                    required
                    value={formData.first_name}
                    onChange={(e) =>
                        handleInputChange('first_name', e.target.value)
                    }
                    aria-describedby="error-registrant-first_name"
                    autoComplete="given-name"
                />
                <span className={styles.bar} />
            </div>

            {/* Middle Name */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-middle_name"
                    name="Registrant[middle_name]"
                    placeholder="Middle Name"
                    fullWidth
                    value={formData.middle_name}
                    onChange={(e) =>
                        handleInputChange('middle_name', e.target.value)
                    }
                    aria-describedby="error-registrant-middle_name"
                    autoComplete="additional-name"
                />
                <span className={styles.bar} />
            </div>

            {/* Last Name */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-last_name"
                    name="Registrant[last_name]"
                    placeholder="Last Name *"
                    fullWidth
                    required
                    value={formData.last_name}
                    onChange={(e) =>
                        handleInputChange('last_name', e.target.value)
                    }
                    aria-describedby="error-registrant-last_name"
                    autoComplete="family-name"
                />
                <span className={styles.bar} />
            </div>

            {/* Title */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-c_6716230"
                    name="Registrant[c_6716230]"
                    placeholder="Title"
                    fullWidth
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    aria-describedby="error-registrant-c_6716230"
                />
                <span className={styles.bar} />
            </div>

            {/* Organization */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="registrant-c_6716228"
                    name="Registrant[c_6716228]"
                    placeholder="Organization"
                    fullWidth
                    value={formData.organization}
                    onChange={(e) =>
                        handleInputChange('organization', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716228"
                />
                <span className={styles.bar} />
            </div>

            {/* Office Phone */}
            <div className={styles.inputWrapper}>
                <Input
                    type="tel"
                    id="registrant-c_6716229"
                    name="Registrant[c_6716229]"
                    placeholder="Office Phone *"
                    fullWidth
                    required
                    value={formData.office_phone}
                    onChange={(e) =>
                        handleInputChange('office_phone', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716229"
                />
                <span className={styles.bar} />
            </div>

            {/* Mobile Phone */}
            <div className={styles.inputWrapper}>
                <Input
                    type="tel"
                    id="registrant-mobile_phone"
                    name="Registrant[mobile_phone]"
                    placeholder="Mobile Phone"
                    fullWidth
                    value={formData.mobile_phone}
                    onChange={(e) =>
                        handleInputChange('mobile_phone', e.target.value)
                    }
                    aria-describedby="error-registrant-mobile_phone"
                />
                <span className={styles.bar} />
            </div>

            {/* Country */}
            <FormControl fullWidth className={styles.formField}>
                <InputLabel>Country</InputLabel>
                <Select
                    name="Address[Registrant][work_address_id][country_code]"
                    label="Country"
                    value={formData.country_code}
                    onChange={(e) =>
                        handleInputChange('country_code', e.target.value)
                    }
                    autoComplete="country"
                ></Select>
            </FormControl>

            {/* Address Line 1 */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="address-registrant-work_address_id-line_1"
                    name="Address[Registrant][work_address_id][line_1]"
                    placeholder="Address Line 1"
                    fullWidth
                    value={formData.address_line_1}
                    onChange={(e) =>
                        handleInputChange('address_line_1', e.target.value)
                    }
                    aria-describedby="error-address-registrant-work_address_id-line_1"
                    autoComplete="address-line1"
                />
                <span className={styles.bar} />
            </div>

            {/* Address Line 2 */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="address-registrant-work_address_id-line_2"
                    name="Address[Registrant][work_address_id][line_2]"
                    placeholder="Address Line 2"
                    fullWidth
                    value={formData.address_line_2}
                    onChange={(e) =>
                        handleInputChange('address_line_2', e.target.value)
                    }
                    aria-describedby="error-address-registrant-work_address_id-line_2"
                    autoComplete="address-line2"
                />
                <span className={styles.bar} />
            </div>

            {/* City */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="address-registrant-work_address_id-city"
                    name="Address[Registrant][work_address_id][city]"
                    placeholder="City"
                    fullWidth
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    aria-describedby="error-address-registrant-work_address_id-city"
                    autoComplete="address-level2"
                />
                <span className={styles.bar} />
            </div>

            {/* State */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="address-registrant-work_address_id-state"
                    name="Address[Registrant][work_address_id][state]"
                    placeholder="State / Province / County"
                    fullWidth
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    aria-describedby="error-address-registrant-work_address_id-state"
                />
                <span className={styles.bar} />
            </div>

            {/* Zip/Postal Code */}
            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    id="address-registrant-work_address_id-zip"
                    name="Address[Registrant][work_address_id][zip]"
                    placeholder="Zip/Postal Code"
                    fullWidth
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    aria-describedby="error-address-registrant-work_address_id-zip"
                    autoComplete="postal-code"
                />
                <span className={styles.bar} />
            </div>

            {/* Profile Picture */}
            <div className={styles.inputWrapper}>
                <label
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                    }}
                >
                    Profile Picture
                </label>
                <input
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
        </div>
    )

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
