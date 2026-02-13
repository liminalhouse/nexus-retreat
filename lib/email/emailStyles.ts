// Shared email styling constants used by both server-side email generation
// and client-side preview components

export const EMAIL_COLORS = {
  navy: '#3d4663',
  navyDark: '#1c2544',
  coral: '#f49898',
  coralLight: '#f5a8a8',
  beige: '#faf5f1',
  seafoam: '#bed1bf',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
  },
} as const

export const EMAIL_FONTS = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const

// HTML style replacements for rich text content
export const BODY_STYLE_REPLACEMENTS: [RegExp, string][] = [
  [
    /<p>/g,
    `<p style="font-family: ${EMAIL_FONTS.sans}; font-size: 15px; color: ${EMAIL_COLORS.gray[600]}; margin: 0 0 16px 0; line-height: 1.7;">`,
  ],
  [
    /<h1>/g,
    `<h1 style="font-family: ${EMAIL_FONTS.serif}; font-size: 26px; font-weight: 600; color: ${EMAIL_COLORS.navy}; margin: 0 0 20px 0; line-height: 1.3;">`,
  ],
  [
    /<h2>/g,
    `<h2 style="font-family: ${EMAIL_FONTS.serif}; font-size: 22px; font-weight: 600; color: ${EMAIL_COLORS.navy}; margin: 24px 0 16px 0; line-height: 1.3;">`,
  ],
  [
    /<h3>/g,
    `<h3 style="font-family: ${EMAIL_FONTS.serif}; font-size: 18px; font-weight: 600; color: ${EMAIL_COLORS.navy}; margin: 20px 0 12px 0; line-height: 1.3;">`,
  ],
  [/<strong>/g, `<strong style="font-weight: 600;">`],
  [
    /<a (?!class="btn")/g,
    `<a style="color: ${EMAIL_COLORS.coral}; font-weight: bold; text-decoration: underline;" `,
  ],
  [
    /<ul>/g,
    `<ul style="margin: 0 0 16px 0; padding-left: 24px; color: ${EMAIL_COLORS.gray[600]};">`,
  ],
  [
    /<ol>/g,
    `<ol style="margin: 0 0 16px 0; padding-left: 24px; color: ${EMAIL_COLORS.gray[600]};">`,
  ],
  [/<li>/g, `<li style="margin-bottom: 8px; line-height: 1.6;">`],
  [
    /<blockquote>/g,
    `<blockquote style="margin: 16px 0; padding: 16px 20px; background: ${EMAIL_COLORS.beige}; border-left: 4px solid ${EMAIL_COLORS.coralLight}; border-radius: 0 8px 8px 0;">`,
  ],
]

// Convert CTA button markers into email-safe button HTML
function convertCtaButtons(html: string): string {
  // Use lookahead for data-cta so attribute order doesn't matter
  return html.replace(
    /<a\s(?=[^>]*data-cta="true")[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g,
    (_match, href, text) =>
      `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;"><tr><td style="background: ${EMAIL_COLORS.coral}; border-radius: 8px;"><a class="btn" href="${href}" style="display: inline-block; padding: 16px 36px; font-family: ${EMAIL_FONTS.sans}; font-size: 15px; font-weight: 600; color: ${EMAIL_COLORS.navyDark}; text-decoration: none;">${text}</a></td></tr></table>`,
  )
}

// Apply all style replacements to HTML content
export function applyEmailStyles(html: string): string {
  // Convert CTA buttons first, before generic <a> styling
  const withCtas = convertCtaButtons(html)
  return BODY_STYLE_REPLACEMENTS.reduce(
    (content, [pattern, replacement]) => content.replace(pattern, replacement),
    withCtas,
  )
}

// CSS style block for email <head> to catch auto-linked URLs by email clients
export const EMAIL_LINK_STYLE_BLOCK = `
  <style>
    table a {
      color: ${EMAIL_COLORS.coral} !important;
      font-weight: bold !important;
      text-decoration: underline !important;
    }
  </style>
`

// Replace template variables with registration data
export function replaceEmailVariables(
  text: string,
  variables: Record<string, string | undefined | null>,
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key]
    return value !== undefined && value !== null ? value : match
  })
}
