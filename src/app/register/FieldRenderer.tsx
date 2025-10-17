import React, { useState } from 'react'
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    IconButton,
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormField } from './rawFormConfig'
import CountrySelect from './CountrySelect'
import styles from '../register/register.module.scss'

// Helper function to convert File to base64 with validation
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            reject(new Error('File size must be less than 5MB'))
            return
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ]
        if (!allowedTypes.includes(file.type)) {
            reject(new Error('File must be an image (JPEG, PNG, GIF, or WebP)'))
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })
}

interface FieldRendererProps {
    field: FormField
    value: any
    onChange: (fieldName: string, value: any, subfield?: string) => void
    onCheckboxChange?: (
        fieldName: string,
        value: string,
        checked: boolean
    ) => void
    onBlur?: (fieldName: string, value: any) => void
    error?: string
    formData?: any
    fieldErrors?: { [key: string]: string }
}

const generateName = (field: FormField): string => {
    return `Registrant[${field.formDataKey}]`
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
    field,
    value,
    onChange,
    onCheckboxChange,
    onBlur,
    error,
    formData,
    fieldErrors,
}) => {
    const id = field.id || field.formDataKey
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
    }

    const renderField = () => {
        const name = generateName(field)
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'password':
                const isCreditCardNumber = field.autoComplete === 'cc-number'
                const isPasswordField = field.type === 'password'

                return (
                    <div className={styles.inputWrapper}>
                        <TextField
                            type={
                                isPasswordField && showPassword
                                    ? 'text'
                                    : field.type
                            }
                            id={id}
                            name={name}
                            label={field.label}
                            variant="outlined"
                            fullWidth
                            required={field.required}
                            value={value || ''}
                            onChange={(e) => {
                                let inputValue = e.target.value
                                // Filter phone number inputs to only allow valid characters
                                if (field.validationType === 'phone') {
                                    inputValue = inputValue.replace(
                                        /[^0-9+\-\s()]/g,
                                        ''
                                    )
                                }
                                // Format credit card number with spaces
                                if (isCreditCardNumber) {
                                    // Remove all non-digit characters
                                    inputValue = inputValue.replace(/\D/g, '')

                                    // Limit to 16 digits
                                    if (inputValue.length > 16) {
                                        inputValue = inputValue.slice(0, 16)
                                    }

                                    // Add space every 4 digits
                                    inputValue = inputValue.replace(
                                        /(\d{4})(?=\d)/g,
                                        '$1 '
                                    )
                                }
                                // Format expiry date as MM/YY
                                if (field.autoComplete === 'cc-exp') {
                                    // Remove all non-digit characters
                                    inputValue = inputValue.replace(/\D/g, '')

                                    // Limit to 4 digits
                                    if (inputValue.length > 4) {
                                        inputValue = inputValue.slice(0, 4)
                                    }

                                    // Add slash after MM
                                    if (inputValue.length >= 2) {
                                        inputValue =
                                            inputValue.slice(0, 2) +
                                            '/' +
                                            inputValue.slice(2)
                                    }
                                }
                                onChange(field.formDataKey!, inputValue)
                            }}
                            onBlur={(e) =>
                                onBlur?.(field.formDataKey!, e.target.value)
                            }
                            autoComplete={field.autoComplete}
                            placeholder={
                                isCreditCardNumber
                                    ? 'xxxx-xxxx-xxxx-xxxx'
                                    : field.placeholder
                            }
                            error={Boolean(error)} // Convert error string to boolean
                            helperText={error} // Show validation error
                            inputProps={{
                                maxLength:
                                    field.autoComplete === 'cc-exp'
                                        ? 5
                                        : isCreditCardNumber
                                        ? 19
                                        : undefined,
                            }}
                            InputProps={
                                isCreditCardNumber
                                    ? {
                                          startAdornment: (
                                              <InputAdornment position="start">
                                                  <CreditCardIcon />
                                              </InputAdornment>
                                          ),
                                          endAdornment: (
                                              <InputAdornment position="end">
                                                  <IconButton
                                                      aria-label="toggle visibility"
                                                      onClick={
                                                          handleClickShowPassword
                                                      }
                                                      onMouseDown={
                                                          handleMouseDownPassword
                                                      }
                                                      edge="end"
                                                  >
                                                      {showPassword ? (
                                                          <Visibility />
                                                      ) : (
                                                          <VisibilityOff />
                                                      )}
                                                  </IconButton>
                                              </InputAdornment>
                                          ),
                                      }
                                    : isPasswordField
                                    ? {
                                          endAdornment: (
                                              <InputAdornment position="end">
                                                  <IconButton
                                                      aria-label="toggle visibility"
                                                      onClick={
                                                          handleClickShowPassword
                                                      }
                                                      onMouseDown={
                                                          handleMouseDownPassword
                                                      }
                                                      edge="end"
                                                  >
                                                      {showPassword ? (
                                                          <Visibility />
                                                      ) : (
                                                          <VisibilityOff />
                                                      )}
                                                  </IconButton>
                                              </InputAdornment>
                                          ),
                                      }
                                    : undefined
                            }
                        />
                        {field.hintText && (
                            <div className={styles.hintBlock}>
                                {field.hintText}
                            </div>
                        )}
                    </div>
                )

            case 'textarea':
                return (
                    <div className={styles.inputWrapper}>
                        <TextField
                            type="text"
                            multiline
                            minRows={field.minRows || 3}
                            id={id}
                            name={name}
                            label={field.label}
                            variant="outlined"
                            fullWidth={true}
                            required={field.required}
                            value={value || ''}
                            onChange={(e) =>
                                onChange(field.formDataKey!, e.target.value)
                            }
                            onBlur={(e) =>
                                onBlur?.(field.formDataKey!, e.target.value)
                            }
                            placeholder={field.placeholder}
                            className={styles.textareaInput}
                            error={Boolean(error)}
                            helperText={error}
                        />
                        {field.hintText && (
                            <div className={styles.hintBlock}>
                                {field.hintText}
                            </div>
                        )}
                    </div>
                )

            case 'select':
                if (field.id === 'country-select') {
                    return (
                        <CountrySelect
                            value={value || ''}
                            onChange={(val) =>
                                onChange(field.formDataKey!, val)
                            }
                            className={styles.formField}
                        />
                    )
                }

                return (
                    <FormControl
                        fullWidth
                        className={styles.formField}
                        error={Boolean(error)}
                    >
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            name={name}
                            label={field.label}
                            value={value || ''}
                            onChange={(e) =>
                                onChange(field.formDataKey!, e.target.value)
                            }
                            onBlur={(e) =>
                                onBlur?.(field.formDataKey!, e.target.value)
                            }
                            required={field.required}
                        >
                            {field.options?.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {error && (
                            <div
                                style={{
                                    color: '#d32f2f',
                                    fontSize: '0.75rem',
                                    marginTop: '3px',
                                    marginLeft: '14px',
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </FormControl>
                )

            case 'checkbox-group':
                return (
                    <div
                        className={styles.inputWrapper}
                        style={{ marginTop: '2rem' }}
                    >
                        <input type="hidden" name={name} value="" />
                        <FormControl fullWidth>
                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                {field.label}
                            </Typography>
                            <FormGroup
                                id={id}
                                aria-labelledby={`field-${id}-label`}
                            >
                                {field.options?.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Checkbox
                                                name={name}
                                                value={option.value}
                                                checked={
                                                    value?.includes(
                                                        option.value
                                                    ) || false
                                                }
                                                onChange={(e) =>
                                                    onCheckboxChange?.(
                                                        field.formDataKey!,
                                                        option.value,
                                                        e.target.checked
                                                    )
                                                }
                                                aria-label={option.ariaLabel}
                                            />
                                        }
                                        label={option.label}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        <div
                            id={field.ariaDescribedBy}
                            className="help-block help-block-error"
                        ></div>
                    </div>
                )

            case 'file':
                return (
                    <div className={styles.inputWrapper}>
                        <InputLabel
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                            }}
                        >
                            {field.label}
                        </InputLabel>
                        <input
                            className={styles.fileInput}
                            type="file"
                            id={id}
                            name={name}
                            accept={field.accept}
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    try {
                                        // Convert file to base64
                                        const base64 = await fileToBase64(file)
                                        onChange(field.formDataKey!, base64)
                                    } catch (error) {
                                        console.error(
                                            'Error converting file to base64:',
                                            error
                                        )
                                        // Show error to user via onBlur if available
                                        if (onBlur) {
                                            onBlur(
                                                field.formDataKey!,
                                                error instanceof Error
                                                    ? error.message
                                                    : 'File upload failed'
                                            )
                                        }
                                        onChange(field.formDataKey!, null)
                                        // Clear the input
                                        e.target.value = ''
                                    }
                                } else {
                                    onChange(field.formDataKey!, null)
                                }
                            }}
                            aria-describedby={field.ariaDescribedBy}
                        />
                        {value &&
                            typeof value === 'string' &&
                            value.startsWith('data:') && (
                                <div
                                    style={{
                                        marginTop: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: '#4caf50',
                                    }}
                                >
                                    ✓ File uploaded successfully (
                                    {Math.round(value.length / 1024)}KB)
                                </div>
                            )}
                        {error && (
                            <div
                                style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#f44336',
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </div>
                )

            case 'fieldset':
                return (
                    <fieldset className={styles.fieldset}>
                        <InputLabel>{field.label}</InputLabel>
                        {field.fields?.map((subField) => (
                            <FieldRenderer
                                key={`${subField.id}-${subField.formDataKey}`}
                                field={subField}
                                value={getNestedValue(
                                    formData,
                                    subField.formDataKey!
                                )}
                                onChange={(key, val) => {
                                    // Handle nested field updates for address
                                    const fieldKey = key?.split('.')?.[1]
                                    if (fieldKey) {
                                        onChange(
                                            'work_address_id',
                                            val,
                                            fieldKey
                                        )
                                    }
                                }}
                                onCheckboxChange={onCheckboxChange}
                                onBlur={onBlur}
                                error={error} // Pass through error for nested fields if needed
                                formData={formData}
                                fieldErrors={fieldErrors}
                            />
                        ))}
                    </fieldset>
                )

            case 'group':
                const isCreditCardGroup = field.id === 'credit-card-group'
                return (
                    <div
                        className={`${styles.fieldGroup} ${
                            styles.groupContainer
                        } ${isCreditCardGroup ? styles.creditCardGroup : ''}`}
                    >
                        <Typography
                            variant="h6"
                            component="h3"
                            className={styles.groupLabel}
                            gutterBottom
                        >
                            {field.label}
                        </Typography>
                        <div className={styles.groupFields}>
                            {field.fields?.map((subField) => {
                                const fieldError = subField.formDataKey
                                    ? fieldErrors?.[subField.formDataKey]
                                    : undefined
                                return (
                                    <FieldRenderer
                                        key={`${subField.id}-${subField.formDataKey}`}
                                        field={subField}
                                        value={getNestedValue(
                                            formData,
                                            subField.formDataKey!
                                        )}
                                        onChange={onChange}
                                        onCheckboxChange={onCheckboxChange}
                                        onBlur={onBlur}
                                        error={fieldError}
                                        formData={formData}
                                        fieldErrors={fieldErrors}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return renderField()
}

// Helper function to get nested values from form data
const getNestedValue = (obj: any, key: string): any => {
    if (!obj) return ''

    // Handle [work_address_id][field] format
    const addressMatch = key.split('.')?.[1]
    if (addressMatch) {
        return obj.work_address_id?.[addressMatch] || ''
    }

    // Handle Registrant[field] format
    const registrantMatch = key.match(/Registrant\[([^\]]+)\]/)
    if (registrantMatch) {
        return obj[registrantMatch[1]] || ''
    }

    // Handle direct keys (e.g., emergency_contact_name, point_of_contact_name)
    return obj[key] || ''
}

export default FieldRenderer
