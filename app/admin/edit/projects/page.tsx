'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react'
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

interface Project {
  id: number
  title: string
  description: string
  role: string
  duration: string
  budget: string
  team: string
  outcomes: string[]
  image?: string
}

interface ProjectsData {
  projects: Project[]
}

export default function EditProjectsPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<ProjectsData | null>(null)
  const [images, setImages] = useState<any[]>([])

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
      const response = await fetch('/api/data?type=projects')
      if (response.ok) {
        const fetchedData = await response.json()
        setData(fetchedData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

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

  const handleProjectChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    if (!data) return

    const updated = [...data.projects]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }

    setData({ projects: updated })
  }

  const handleOutcomeChange = (projectIndex: number, outcomeIndex: number, value: string) => {
    if (!data) return

    const updated = [...data.projects]
    updated[projectIndex].outcomes[outcomeIndex] = value

    setData({ projects: updated })
  }

  const handleAddOutcome = (projectIndex: number) => {
    if (!data) return

    const updated = [...data.projects]
    updated[projectIndex].outcomes.push('')

    setData({ projects: updated })
  }

  const handleDeleteOutcome = (projectIndex: number, outcomeIndex: number) => {
    if (!data) return

    const updated = [...data.projects]
    updated[projectIndex].outcomes = updated[projectIndex].outcomes.filter(
      (_, i) => i !== outcomeIndex
    )

    setData({ projects: updated })
  }

  const handleAddProject = () => {
    if (!data) return

    const newId = Math.max(...data.projects.map((p) => p.id), 0) + 1

    setData({
      projects: [
        ...data.projects,
        {
          id: newId,
          title: '',
          description: '',
          role: '',
          duration: '',
          budget: '',
          team: '',
          outcomes: [],
        },
      ],
    })
  }

  const handleDeleteProject = (index: number) => {
    if (!data) return

    setData({
      projects: data.projects.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!data) return

    setSaving(true)
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'projects',
          data,
        }),
      })

      if (response.ok) {
        toast.success('Dự án đã được cập nhật')
      } else {
        toast.error('Lỗi khi cập nhật')
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
            <h1 className="text-xl font-bold">Chỉnh Sửa Dự Án</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
        {data && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Dự Án Hoàn Thành</h2>
                <p className="text-muted-foreground">Quản lý danh sách dự án</p>
              </div>
              <Button onClick={handleAddProject} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm Dự Án
              </Button>
            </div>

            {data.projects.map((project, index) => (
              <Card key={project.id} className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">Dự Án #{index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Tên Dự Án
                    </label>
                    <Input
                      value={project.title}
                      onChange={(e) =>
                        handleProjectChange(index, 'title', e.target.value)
                      }
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mô Tả
                    </label>
                    <Textarea
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(index, 'description', e.target.value)
                      }
                      rows={3}
                      className="border-border resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                      Hình Ảnh Dự Án
                    </label>
                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                       <div className="bg-muted rounded-lg overflow-hidden border border-border">
                          <AspectRatio ratio={16/9}>
                            {project.image ? (
                              <img src={project.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-xs">
                                Chưa có ảnh
                              </div>
                            )}
                          </AspectRatio>
                       </div>
                       <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input 
                              placeholder="URL Hình ảnh" 
                              value={project.image || ''} 
                              onChange={(e) => handleProjectChange(index, 'image', e.target.value)}
                              className="border-border"
                            />
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={fetchImages}>Chọn từ kho</Button>
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
                                      onClick={() => handleProjectChange(index, 'image', img.url)}
                                    >
                                      <AspectRatio ratio={16/9}>
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

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Vai Trò</label>
                      <Input
                        value={project.role}
                        onChange={(e) =>
                          handleProjectChange(index, 'role', e.target.value)
                        }
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Thời Gian
                      </label>
                      <Input
                        value={project.duration}
                        onChange={(e) =>
                          handleProjectChange(index, 'duration', e.target.value)
                        }
                        placeholder="2020-2023"
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Ngân Sách
                      </label>
                      <Input
                        value={project.budget}
                        onChange={(e) =>
                          handleProjectChange(index, 'budget', e.target.value)
                        }
                        placeholder="380 tỷ đồng"
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Đội Ngũ
                      </label>
                      <Input
                        value={project.team}
                        onChange={(e) =>
                          handleProjectChange(index, 'team', e.target.value)
                        }
                        placeholder="15 kỹ sư + 50+ công nhân"
                        className="border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">
                        Kết Quả Đạt Được
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOutcome(index)}
                        className="gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {project.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="flex gap-2">
                          <Input
                            value={outcome}
                            onChange={(e) =>
                              handleOutcomeChange(index, outcomeIndex, e.target.value)
                            }
                            className="border-border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteOutcome(index, outcomeIndex)
                            }
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 w-full"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu Tất Cả Thay Đổi
                </>
              )}
            </Button>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
