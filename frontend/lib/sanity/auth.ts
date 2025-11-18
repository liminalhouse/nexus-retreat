/**
 * Sanity authentication helpers
 * Verifies that a user has access to the Sanity project
 */

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET!

/**
 * Verify a Sanity token is valid by making a test query
 */
export async function verifySanityToken(token: string): Promise<boolean> {
  try {
    const query = encodeURIComponent('*[_type == "settings"][0]{_id}')
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${query}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error verifying Sanity token:', error)
    return false
  }
}

type SanityUser = {
  id: string
  name: string
  email: string
  profileImage?: string
}

/**
 * Get user info from Sanity token
 */
export async function getSanityUserInfo(token: string): Promise<SanityUser | null> {
  try {
    const response = await fetch('https://api.sanity.io/v2021-06-07/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Map Sanity API response to our User type
    // Sanity returns: { id, displayName, email, imageUrl, ... }
    return {
      id: data.id,
      name: data.displayName || data.name || 'Unknown User',
      email: data.email || '',
      profileImage: data.imageUrl || data.profileImage,
    }
  } catch (error) {
    console.error('Error getting Sanity user info:', error)
    return null
  }
}
