'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Plus, Trash2, Upload, Link as LinkIcon, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface ImageItem {
  id: string
  name: string
  url: string
  type: 'upload' | 'link'
  public_id?: string
}

export default function ImageManagementPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<ImageItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login')
    }
    if (status === 'authenticated') {
      fetchImages()
    }
  }, [status])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/data?type=images')
      if (res.ok) {
        const data = await res.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveImages = async (updatedImages: ImageItem[]) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'images', data: { images: updatedImages } }),
      })
      if (res.ok) {
        setImages(updatedImages)
        return true
      }
    } catch (error) {
      console.error('Error saving images:', error)
      toast.error('Lỗi khi lưu dữ liệu')
    }
    return false
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        const newImage: ImageItem = {
          id: `img_${Date.now()}`,
          name: file.name,
          url: data.url,
          type: 'upload',
          public_id: data.publicId,
        }
        const updated = [newImage, ...images]
        if (await saveImages(updated)) {
          toast.success('Đã tải ảnh lên')
        }
      } else {
        toast.error(data.error || 'Lỗi khi tải ảnh lên')
      }
    } catch (error) {
      toast.error('Lỗi kết nối server')
    } finally {
      setUploading(false)
    }
  }

  const handleAddLink = async () => {
    if (!newUrl || !newName) {
      toast.error('Vui lòng nhập tên và link ảnh')
      return
    }

    const newImage: ImageItem = {
      id: `img_${Date.now()}`,
      name: newName,
      url: newUrl,
      type: 'link',
    }
    const updated = [newImage, ...images]
    if (await saveImages(updated)) {
      setNewUrl('')
      setNewName('')
      toast.success('Đã thêm link ảnh')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá ảnh này?')) return

    const updated = images.filter((img) => img.id !== id)
    if (await saveImages(updated)) {
      toast.success('Đã xoá ảnh')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Quản Lý Hình Ảnh</h1>
          </div>
        </header>

        <main className="flex-1 px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Upload Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tải Lên Hình Ảnh</CardTitle>
                  <CardDescription>Chọn tệp từ máy tính của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      asChild
                      disabled={uploading}
                      className="w-full cursor-pointer gap-2"
                    >
                      <label htmlFor="image-upload">
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading ? 'Đang tải lên...' : 'Chọn Tệp'}
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Link Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thêm Link Hình Ảnh</CardTitle>
                  <CardDescription>Sử dụng URL ảnh từ bên ngoài</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Tên hình ảnh"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                    <Button onClick={handleAddLink} className="gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Thêm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Kho Hình Ảnh</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.length === 0 ? (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p>Chưa có hình ảnh nào</p>
                  </div>
                ) : (
                  images.map((img) => (
                    <Card key={img.id} className="overflow-hidden group">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <CardContent className="p-3 space-y-2">
                        <p className="text-sm font-medium truncate">{img.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground capitalize">
                            {img.type === 'upload' ? 'Tệp tải lên' : 'Liên kết'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(img.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
