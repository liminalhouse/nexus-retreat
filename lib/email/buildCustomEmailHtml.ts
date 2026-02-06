import {EMAIL_COLORS, EMAIL_FONTS, applyEmailStyles} from './emailStyles'

/**
 * Shared email document wrapper used by both transactional and custom emails.
 * Single source of truth for the outer HTML structure, head, styles, and footer.
 */
export function buildEmailWrapper(options: {
  heading?: string
  headerImageHtml?: string
  innerContent: string
  cardPadding?: string
}): string {
  const {heading, headerImageHtml = '', innerContent, cardPadding = '40px 40px 32px 40px'} = options

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Nexus Retreat</title>
        <style>
          a {
            color: ${EMAIL_COLORS.coral};
            font-weight: bold;
            text-decoration: underline;
          }
          a.unsubscribe {
            color: ${EMAIL_COLORS.gray[400]} !important;
            font-weight: normal !important;
          }
        </style>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: ${EMAIL_COLORS.beige}; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${EMAIL_COLORS.beige};">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
                ${
                  heading
                    ? `<!-- Logo/Header Section -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <span style="font-family: ${EMAIL_FONTS.serif}; font-size: 28px; font-weight: 600; color: ${EMAIL_COLORS.navy}; letter-spacing: -0.5px;">${heading}</span>
                  </td>
                </tr>`
                    : ''
                }
                <!-- Main Content Card -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${EMAIL_COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                      ${headerImageHtml}
                      <tr>
                        <td style="padding: ${cardPadding};">
                          ${innerContent}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px;">
                    <p style="font-family: ${EMAIL_FONTS.sans}; font-size: 13px; color: ${EMAIL_COLORS.gray[400]}; margin: 0 0 8px 0;">
                      Nexus Retreat &middot; Boca Raton, Florida &middot; March 18-20, 2026
                    </p>
                    <p style="font-family: ${EMAIL_FONTS.sans}; font-size: 12px; color: ${EMAIL_COLORS.gray[400]}; margin: 0 0 8px 0;">
                      Questions? Contact us at <a href="mailto:info@nexus-retreat.com" style="color: ${EMAIL_COLORS.coral}; text-decoration: none;">info@nexus-retreat.com</a>
                    </p>
                    <p style="font-family: ${EMAIL_FONTS.sans}; font-size: 11px; color: ${EMAIL_COLORS.gray[400]}; margin: 0;">
                      <a class="unsubscribe" href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-retreat.com'}/unsubscribe" style="color: ${EMAIL_COLORS.gray[400]}; font-weight: normal; text-decoration: underline;">Click here to unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

/**
 * Builds the full HTML document for custom/bulk admin emails.
 * Shared between the actual send path (sendEmail.ts) and the
 * client-side preview (EmailPreview.tsx) so they stay 1-to-1.
 */
export function buildCustomEmailHtml(options: {
  heading?: string
  body: string
  headerImageUrl?: string
}): string {
  const {heading, body, headerImageUrl} = options

  const headerImageHtml = headerImageUrl
    ? `<tr>
         <td style="padding: 0; line-height: 0; font-size: 0;">
           <img src="${headerImageUrl}" alt="Nexus Retreat" style="width: 100%; height: auto; display: block; border-radius: 16px 16px 0 0;" />
         </td>
       </tr>`
    : ''

  const styledBody = applyEmailStyles(body)

  return buildEmailWrapper({
    heading,
    headerImageHtml,
    innerContent: styledBody,
    cardPadding: headerImageUrl ? '32px 40px 32px 40px' : '40px 40px 32px 40px',
  })
}
