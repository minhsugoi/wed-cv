import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getCloudinary } from '@/lib/cloudinary'

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

    const cloudinary = getCloudinary()
    const folder = process.env.CLOUDINARY_FOLDER || undefined

    const uploadResult = await new Promise<{
      secure_url: string
      public_id: string
      original_filename?: string
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'))
            return
          }
          resolve(result as any)
        }
      )
      stream.end(buffer)
    })

    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
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
