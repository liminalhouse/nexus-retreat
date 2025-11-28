/**
 * Map background color values from Sanity to Tailwind CSS classes
 * Handles Sanity Stega encoding which adds invisible Unicode characters
 */
export function getBgColorClass(bgColor?: string | null): string {
  // Remove invisible Unicode characters (Sanity Stega encoding)
  const cleanValue = bgColor?.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim()

  switch (cleanValue) {
    case 'beige':
      return 'bg-nexus-beige'
    case 'navy':
      return 'bg-nexus-navy'
    case 'blueGradient':
      return 'bg-gradient-to-r from-nexus-navy to-nexus-blue'
    case 'white':
      return 'bg-white'
    default:
      return 'bg-white'
  }
}
