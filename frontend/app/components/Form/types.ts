// Manual type definitions for the registration form
// These types mirror the Sanity schema but are defined independently
// to avoid issues with null types when no documents exist yet

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  fieldType:
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'checkboxGroup'
    | 'radio'
  label?: string
  name?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  options?: FormFieldOption[]
}

export interface FieldGroup {
  groupTitle?: string
  groupDescription?: string
  fields?: FormField[]
}

export interface FormStep {
  title?: string
  fieldGroups?: FieldGroup[]
}

export interface FormBuilder {
  step1?: FormStep
  step2?: FormStep
  step3?: FormStep
}

export interface FormConfig {
  _id?: string
  _type?: string
  title?: string
  subtitle?: string
  description?: string
  formBuilder?: FormBuilder
  submitButtonText?: string
  nextButtonText?: string
  backButtonText?: string
  successMessage?: string
  submitEndpoint?: string
}

// For backward compatibility with registration form
export interface RegistrationFormConfig extends FormConfig {
  eventDate?: string
  backToHomeText?: string
}
