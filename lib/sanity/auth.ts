type SanityUser = {
  id: string
  name: string
  email: string
  profileImage?: string
}

export async function getSanityUserInfo(token: string): Promise<SanityUser | null> {
  try {
    const response = await fetch('https://api.sanity.io/v2021-06-07/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) return null

    const data = await response.json()

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
