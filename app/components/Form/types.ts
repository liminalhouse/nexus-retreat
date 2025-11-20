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
    | 'file'
  label?: string
  name?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  options?: FormFieldOption[]
  defaultValue?: string | string[] | boolean
  hidden?: boolean
  accept?: string
}

export interface FieldGroup {
  groupTitle?: string
  groupDescription?: string
  fields?: FormField[]
  showIfFieldHasValue?: string | string[]
  hidden?: boolean
}

export interface FormStep {
  title?: string
  fieldGroups?: FieldGroup[]
}

export interface FormConfig {
  _id?: string
  _type?: string
  title?: string
  subtitle?: string
  description?: string
  numberOfSteps?: number
  step1?: FormStep
  step2?: FormStep
  step3?: FormStep
  submitButtonText?: string
  nextButtonText?: string
  backButtonText?: string
  successMessage?: string
  submitEndpoint?: string
}
