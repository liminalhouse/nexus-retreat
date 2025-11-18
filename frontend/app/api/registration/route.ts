import {NextRequest, NextResponse} from 'next/server'
import {getSupabaseAdmin} from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Extract standard fields (if they exist)
    const {email, first_name, last_name, phone, ...additionalData} = formData

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        {success: false, message: 'Email is required'},
        {status: 400},
      )
    }

    const supabase = getSupabaseAdmin()

    // Insert into Supabase - works with ANY form structure!
    const {data, error} = await supabase
      .from('registrations')
      .insert({
        email,
        first_name: first_name || null,
        last_name: last_name || null,
        phone: phone || null,
        form_data: formData, // Store ALL data including custom fields
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        {success: false, message: 'Failed to save registration'},
        {status: 500},
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration submitted successfully',
        data,
      },
      {status: 200},
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {success: false, message: 'Failed to process registration'},
      {status: 500},
    )
  }
}
