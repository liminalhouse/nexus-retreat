export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_REGEX = /^[\d\s\-\(\)\+\.]+$/
export const MIN_PHONE_DIGITS = 10

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value)
}

export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value) && value.replace(/\D/g, '').length >= MIN_PHONE_DIGITS
}
