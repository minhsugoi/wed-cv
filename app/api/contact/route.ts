import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền các trường bắt buộc' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('inquiries')
      .insert([
        { 
          name, 
          email, 
          subject: phone, // Mapping phone to subject for now based on previous schema, or we need to update schema
          message 
        }
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã gửi tin nhắn. Tôi sẽ liên hệ với bạn sớm nhất có thể.',
    })
  } catch (error) {
    console.error('Error processing contact submission:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('inquiries')
      .select('id, name, email, subject, message, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase select error:', error)
      throw error
    }
    
    // Map to expected structure if needed
    const inquiries = data.map(item => ({
      id: item.id.toString(),
      name: item.name,
      email: item.email,
      phone: item.subject, // Map back
      message: item.message,
      submittedAt: item.created_at
    }))

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error reading inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to read inquiries' },
      { status: 500 }
    )
  }
}
