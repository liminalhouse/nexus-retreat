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
    Box,
    Typography,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
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
        c_6716239: '', // guest_email
        c_6838231: [], // activities
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

    const handleCheckboxChange = (
        field: keyof FormData,
        value: string,
        checked: boolean
    ) => {
        setFormData((prev) => {
            const currentArray = prev[field] as string[]
            const newArray = checked
                ? [...currentArray, value]
                : currentArray.filter(item => item !== value)

            return {
                ...prev,
                [field]: newArray,
            }
        })
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

            <fieldset className={styles.fieldset}>
                <InputLabel>Work Address</InputLabel>
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
                        handleInputChange(
                            'work_address_id',
                            value,
                            'country_code'
                        )
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
            </fieldset>

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

    const renderStage3 = () => (
        <div className={styles.inputGroup}>
            {/* Point of Contact Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716225"
                    name="Registrant[c_6716225]"
                    label="Point of Contact Name *"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716225}
                    onChange={(e) =>
                        handleInputChange('c_6716225', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716225"
                />
            </div>

            {/* Point of Contact Title */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716226"
                    name="Registrant[c_6716226]"
                    label="Point of Contact Title"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6716226}
                    onChange={(e) =>
                        handleInputChange('c_6716226', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716226"
                />
            </div>

            {/* Point of Contact Email */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="email"
                    id="registrant-c_6716231"
                    name="Registrant[c_6716231]"
                    label="Point of Contact Email *"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.c_6716231}
                    onChange={(e) =>
                        handleInputChange('c_6716231', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716231"
                />
            </div>

            {/* Point of Contact Phone */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="tel"
                    id="registrant-c_6716232"
                    name="Registrant[c_6716232]"
                    label="Point of Contact Phone"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6716232}
                    onChange={(e) =>
                        handleInputChange('c_6716232', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716232"
                />
            </div>

            {/* Secondary Point of Contact Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6716234"
                    name="Registrant[c_6716234]"
                    label="Secondary Point of Contact Name"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6716234}
                    onChange={(e) =>
                        handleInputChange('c_6716234', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716234"
                />
            </div>

            {/* Secondary Point of Contact Email */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="email"
                    id="registrant-c_6716236"
                    name="Registrant[c_6716236]"
                    label="Secondary Point of Contact Email"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6716236}
                    onChange={(e) =>
                        handleInputChange('c_6716236', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716236"
                />
            </div>

            {/* Secondary Point of Contact Phone */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="tel"
                    id="registrant-c_6716237"
                    name="Registrant[c_6716237]"
                    label="Secondary Point of Contact Phone"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6716237}
                    onChange={(e) =>
                        handleInputChange('c_6716237', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716237"
                />
            </div>

            {/* Guest Name */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="text"
                    id="registrant-c_6832581"
                    name="Registrant[c_6832581]"
                    label="Guest Name"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6832581}
                    onChange={(e) =>
                        handleInputChange('c_6832581', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6832581"
                />
            </div>

            {/* Guest Email */}
            <div className={styles.inputWrapper}>
                <TextField
                    type="email"
                    id="registrant-c_6716239"
                    name="Registrant[c_6716239]"
                    label="Guest Email"
                    variant="outlined"
                    fullWidth
                    value={formData.c_6716239}
                    onChange={(e) =>
                        handleInputChange('c_6716239', e.target.value)
                    }
                    aria-describedby="error-registrant-c_6716239"
                />
            </div>

            {/* Activities */}
            <div className={styles.inputWrapper}>
                <input type="hidden" name="Registrant[c_6838231]" value="" />
                <FormControl fullWidth>
                    <Typography variant="h6" gutterBottom>
                        Activities
                    </Typography>
                    <FormGroup
                        id="registrant-c_6838231"
                        aria-labelledby="field-registrant-c_6838231-label"
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626531"
                                    checked={formData.c_6838231.includes('39626531')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626531',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Pickleball tournament (upriver / downriver style) on March 19"
                                />
                            }
                            label="Pickleball tournament (upriver / downriver style) on March 19"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626575"
                                    checked={formData.c_6838231.includes('39626575')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626575',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Golf - Full round"
                                />
                            }
                            label="Golf - Full round"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626586"
                                    checked={formData.c_6838231.includes('39626586')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626586',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Golf - 9 holes"
                                />
                            }
                            label="Golf - 9 holes"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626588"
                                    checked={formData.c_6838231.includes('39626588')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626588',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Golf challenge with a pro"
                                />
                            }
                            label="Golf challenge with a pro"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626589"
                                    checked={formData.c_6838231.includes('39626589')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626589',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Tennis"
                                />
                            }
                            label="Tennis"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626590"
                                    checked={formData.c_6838231.includes('39626590')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626590',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Tennis challenge with a pro"
                                />
                            }
                            label="Tennis challenge with a pro"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626592"
                                    checked={formData.c_6838231.includes('39626592')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626592',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Sailing excursion with a SailGP team member"
                                />
                            }
                            label="Sailing excursion with a SailGP team member"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Registrant[c_6838231][]"
                                    value="39626591"
                                    checked={formData.c_6838231.includes('39626591')}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            'c_6838231',
                                            '39626591',
                                            e.target.checked
                                        )
                                    }
                                    aria-label="Please don't bother me, I'll be at the spa :)"
                                />
                            }
                            label="Please don't bother me, I'll be at the spa :)"
                        />
                    </FormGroup>
                </FormControl>
                <div
                    id="error-registrant-c_6838231"
                    className="help-block help-block-error"
                ></div>
            </div>
        </div>
    )

    return (
        <form
            className={styles.form}
            onSubmit={currentStage === 3 ? handleSubmit : handleNextStage}
        >
            {currentStage === 1
                ? renderStage1()
                : currentStage === 2
                ? renderStage2()
                : renderStage3()}

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
                        <Step>
                            <StepLabel>
                                Personal & Contact Information
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Additional Details</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Event Details & Contacts</StepLabel>
                        </Step>
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
