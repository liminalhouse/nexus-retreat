import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {toPlainText} from '@portabletext/react'

export async function GET() {
  try {
    const query = `*[_type == "emailTemplate" && isActive == true] | order(name asc) {
      _id,
      name,
      type,
      subject,
      greeting,
      bodyIntro,
      bodyOutro,
      signature
    }`

    const templates = await client.fetch(query)

    // Convert portable text to HTML for bodyIntro and bodyOutro
    const processedTemplates = templates.map(
      (template: {
        _id: string
        name: string
        type: string
        subject: string
        greeting: string
        bodyIntro: any[] | null
        bodyOutro: any[] | null
        signature: string | null
      }) => ({
        ...template,
        bodyIntroText: template.bodyIntro ? toPlainText(template.bodyIntro) : '',
        bodyOutroText: template.bodyOutro ? toPlainText(template.bodyOutro) : '',
      }),
    )

    return NextResponse.json({templates: processedTemplates})
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch email templates',
        templates: [],
      },
      {status: 500},
    )
  }
}
