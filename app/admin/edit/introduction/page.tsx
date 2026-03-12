'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface IntroductionData {
  fullName: string
  title: string
  specializations: string[]
  bio: string
  email: string
  phone: string
  location: string
  profileImage?: string
}

export default function EditIntroductionPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<IntroductionData | null>(null)
  const [images, setImages] = useState<any[]>([])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/data?type=images')
      if (res.ok) {
        const imageData = await res.json()
        setImages(imageData.images || [])
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchImages()
    }
  }, [status])

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login')
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data?type=introduction')
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return

    const { name, value } = e.target

    if (name === 'specializations') {
      setFormData({
        ...formData,
        [name]: value.split(',').map((s) => s.trim()),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSave = async () => {
    if (!formData) return

    setSaving(true)
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'introduction',
          data: formData,
        }),
      })

      if (response.ok) {
        toast.success('Thông tin đã được cập nhật')
      } else {
        toast.error('Lỗi khi cập nhật thông tin')
      }
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error('Lỗi khi cập nhật')
    } finally {
      setSaving(false)
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
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold">Chỉnh Sửa Giới Thiệu</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
        {formData && (
          <div className="space-y-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Thông Tin Cá Nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin giới thiệu cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Họ và Tên
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Chức Vụ
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="border-border"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">
                    Chuyên Môn
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-background/50 min-h-[50px]">
                    {formData.specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 group hover:bg-primary/20 transition-colors"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => {
                            const newSpecs = formData.specializations.filter((_, i) => i !== index)
                            setFormData({ ...formData, specializations: newSpecs })
                          }}
                          className="ml-1 p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <input
                      className="flex-1 bg-transparent border-none outline-none text-sm min-w-[150px] focus:ring-0 placeholder:text-muted-foreground"
                      placeholder="Nhấn Enter để thêm chuyên môn..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const val = e.currentTarget.value.trim()
                          if (val && !formData.specializations.includes(val)) {
                            setFormData({
                              ...formData,
                              specializations: [...formData.specializations, val]
                            })
                            e.currentTarget.value = ''
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Nhập tên chuyên môn và nhấn Enter để thêm thẻ mới.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Giới Thiệu
                  </label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="border-border resize-none"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Điện Thoại
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Địa Điểm
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border-border"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">
                    Ảnh Đại Diện
                  </label>
                  <div className="grid gap-4 md:grid-cols-2 mt-2">
                     <div className="bg-muted rounded-full overflow-hidden border border-border w-32 h-32 mx-auto md:mx-0">
                        {formData.profileImage ? (
                          <img src={formData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-xs">
                            Chưa có ảnh
                          </div>
                        )}
                     </div>
                     <div className="space-y-3 flex flex-col justify-center">
                        <div className="flex gap-2">
                          <Input 
                            name="profileImage"
                            placeholder="URL Hình ảnh" 
                            value={formData.profileImage || ''} 
                            onChange={handleChange}
                            className="border-border"
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={fetchImages}>Kho ảnh</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Kho Hình Ảnh</DialogTitle>
                                <DialogDescription>Chọn một hình ảnh từ kho đã tải lên</DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-3 gap-3 pt-4">
                                {images.map((img) => (
                                  <div 
                                    key={img.id} 
                                    className="cursor-pointer group relative rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                                    onClick={() => setFormData({...formData, profileImage: img.url})}
                                  >
                                    <AspectRatio ratio={1 / 1}>
                                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                    </AspectRatio>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-white text-xs font-medium px-2 py-1 bg-primary rounded">Chọn</span>
                                    </div>
                                  </div>
                                ))}
                                {images.length === 0 && (
                                  <div className="col-span-full py-8 text-center text-muted-foreground">
                                    Kho ảnh trống. Hãy tải ảnh lên trong mục "Hình Ảnh".
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Bạn có thể dán link trực tiếp hoặc chọn từ kho ảnh đã quản lý.
                        </p>
                     </div>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2 w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu Thay Đổi
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
