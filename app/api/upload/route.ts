import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure images directory exists
    const uploadDir = join(process.cwd(), 'public', 'images')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Ignore if directory already exists
    }

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const path = join(uploadDir, filename)
    
    await writeFile(path, buffer)
    
    const url = `/images/${filename}`

    return NextResponse.json({ 
      success: true, 
      url,
      name: file.name
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
