import React from 'react'
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
} from '@mui/material'
import { FormField } from './formConfig'
import CountrySelect from './CountrySelect'
import styles from '../register/register.module.scss'

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
    const renderField = () => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
                return (
                    <div className={styles.inputWrapper}>
                        <TextField
                            type={field.type}
                            id={field.id}
                            name={field.name}
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
                                onChange(field.name, inputValue)
                            }}
                            onBlur={(e) => onBlur?.(field.name, e.target.value)}
                            autoComplete={field.autoComplete}
                            placeholder={field.placeholder}
                            error={Boolean(error)} // Convert error string to boolean
                            helperText={error} // Show validation error
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
                            id={field.id}
                            name={field.name}
                            label={field.label}
                            variant="outlined"
                            fullWidth
                            required={field.required}
                            value={value || ''}
                            onChange={(e) =>
                                onChange(field.name, e.target.value)
                            }
                            onBlur={(e) => onBlur?.(field.name, e.target.value)}
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
                            onChange={(val) => onChange(field.name, val)}
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
                            name={field.name}
                            label={field.label}
                            value={value || ''}
                            onChange={(e) =>
                                onChange(field.name, e.target.value)
                            }
                            onBlur={(e) => onBlur?.(field.name, e.target.value)}
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
                        <input type="hidden" name={field.name} value="" />
                        <FormControl fullWidth>
                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                {field.label}
                            </Typography>
                            <FormGroup
                                id={field.id}
                                aria-labelledby={`field-${field.id}-label`}
                            >
                                {field.options?.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Checkbox
                                                name={`${field.name}[]`}
                                                value={option.value}
                                                checked={
                                                    value?.includes(
                                                        option.value
                                                    ) || false
                                                }
                                                onChange={(e) =>
                                                    onCheckboxChange?.(
                                                        field.name,
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
                            id={field.id}
                            name={field.name}
                            accept={field.accept}
                            onChange={(e) =>
                                onChange(
                                    field.name,
                                    e.target.files?.[0] || null
                                )
                            }
                            aria-describedby={field.ariaDescribedBy}
                        />
                    </div>
                )

            case 'fieldset':
                return (
                    <fieldset className={styles.fieldset}>
                        <InputLabel>{field.label}</InputLabel>
                        {field.fields?.map((subField) => (
                            <FieldRenderer
                                key={subField.id}
                                field={subField}
                                value={getNestedValue(formData, subField.name)}
                                onChange={(name, val) => {
                                    // Handle nested field updates for address
                                    const fieldKey =
                                        subField.name.match(/\[(\w+)\]$/)?.[1]
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
                return (
                    <div
                        className={`${styles.fieldGroup} ${styles.groupContainer}`}
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
                            {field.fields?.map((subField) => (
                                <FieldRenderer
                                    key={subField.id}
                                    field={subField}
                                    value={getNestedValue(
                                        formData,
                                        subField.name
                                    )}
                                    onChange={onChange}
                                    onCheckboxChange={onCheckboxChange}
                                    onBlur={onBlur}
                                    error={
                                        subField.formDataKey
                                            ? fieldErrors?.[
                                                  subField.formDataKey
                                              ]
                                            : undefined
                                    }
                                    formData={formData}
                                    fieldErrors={fieldErrors}
                                />
                            ))}
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
const getNestedValue = (obj: any, path: string): any => {
    if (!obj) return ''

    // Handle Address[Registrant][work_address_id][field] format
    const addressMatch = path.match(
        /Address\[Registrant\]\[work_address_id\]\[(\w+)\]/
    )
    if (addressMatch) {
        return obj.work_address_id?.[addressMatch[1]] || ''
    }

    // Handle Registrant[field] format
    const registrantMatch = path.match(/Registrant\[([^\]]+)\]/)
    if (registrantMatch) {
        return obj[registrantMatch[1]] || ''
    }

    return ''
}

export default FieldRenderer
