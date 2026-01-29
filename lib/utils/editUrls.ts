/**
 * Utility functions for generating edit registration URLs
 */

function getBaseUrl(): string {
  // Server-side: use env variable
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'
  }
  // Client-side: use current origin
  return window.location.origin
}

export function getEditRegistrationUrl(token: string): string {
  return `${getBaseUrl()}/edit-registration/${token}`
}

export function getEditActivitiesUrl(token: string): string {
  return `${getBaseUrl()}/edit-registration/${token}/activities`
}
