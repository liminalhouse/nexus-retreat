import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {emailTemplates} from '@/lib/db/schema'
import {desc} from 'drizzle-orm'

export async function GET() {
  try {
    const templates = await db
      .select()
      .from(emailTemplates)
      .orderBy(desc(emailTemplates.updatedAt))

    return NextResponse.json({success: true, templates})
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to fetch email templates', templates: []},
      {status: 500}
    )
  }
}

export async function POST(request: Request) {
  try {
    const {name, heading, headerImageUrl, subject, body} = await request.json()

    if (!name?.trim() || !subject?.trim() || !body?.trim()) {
      return NextResponse.json(
        {success: false, error: 'Name, subject, and body are required'},
        {status: 400}
      )
    }

    const [template] = await db
      .insert(emailTemplates)
      .values({
        name: name.trim(),
        heading: heading?.trim() || null,
        headerImageUrl: headerImageUrl?.trim() || null,
        subject: subject.trim(),
        body: body.trim(),
      })
      .returning()

    return NextResponse.json({success: true, template})
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to create email template'},
      {status: 500}
    )
  }
}
