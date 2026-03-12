import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const dataDir = join(process.cwd(), 'data')

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  submittedAt: string
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền các trường bắt buộc' },
        { status: 400 }
      )
    }

    // Read existing inquiries
    const inquiriesPath = join(dataDir, 'inquiries.json')
    const inquiriesData = JSON.parse(readFileSync(inquiriesPath, 'utf-8'))
    
    // Create new inquiry
    const newInquiry: ContactSubmission = {
      id: `inquiry_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      message,
      submittedAt: new Date().toISOString(),
    }

    // Add to inquiries
    inquiriesData.inquiries.push(newInquiry)
    
    // Write back to file
    writeFileSync(inquiriesPath, JSON.stringify(inquiriesData, null, 2))

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
    const inquiriesPath = join(dataDir, 'inquiries.json')
    const data = JSON.parse(readFileSync(inquiriesPath, 'utf-8'))
    return NextResponse.json(data.inquiries)
  } catch (error) {
    console.error('Error reading inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to read inquiries' },
      { status: 500 }
    )
  }
}
