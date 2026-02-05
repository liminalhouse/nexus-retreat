import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {emailTemplates} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params
    const {name, heading, subject, body} = await request.json()

    if (!name?.trim() || !subject?.trim() || !body?.trim()) {
      return NextResponse.json(
        {success: false, error: 'Name, subject, and body are required'},
        {status: 400}
      )
    }

    const [template] = await db
      .update(emailTemplates)
      .set({
        name: name.trim(),
        heading: heading?.trim() || null,
        subject: subject.trim(),
        body: body.trim(),
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.id, id))
      .returning()

    if (!template) {
      return NextResponse.json({success: false, error: 'Template not found'}, {status: 404})
    }

    return NextResponse.json({success: true, template})
  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to update email template'},
      {status: 500}
    )
  }
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params

    const [deleted] = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, id))
      .returning()

    if (!deleted) {
      return NextResponse.json({success: false, error: 'Template not found'}, {status: 404})
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to delete email template'},
      {status: 500}
    )
  }
}
