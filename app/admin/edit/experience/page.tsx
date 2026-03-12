'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Experience {
  id: number
  position: string
  company: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
}

interface ExperienceData {
  experiences: Experience[]
}

export default function EditExperiencePage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<ExperienceData | null>(null)

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
      const response = await fetch('/api/data?type=experience')
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

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    if (!data) return

    const updated = [...data.experiences]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }

    setData({ experiences: updated })
  }

  const handleAddExperience = () => {
    if (!data) return

    const newId = Math.max(...data.experiences.map((e) => e.id), 0) + 1

    setData({
      experiences: [
        ...data.experiences,
        {
          id: newId,
          position: '',
          company: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: null,
          isCurrent: false,
          description: '',
        },
      ],
    })
  }

  const handleDeleteExperience = (index: number) => {
    if (!data) return

    setData({
      experiences: data.experiences.filter((_, i) => i !== index),
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
          type: 'experience',
          data,
        }),
      })

      if (response.ok) {
        toast.success('Kinh nghiệm đã được cập nhật')
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
            <h1 className="text-xl font-bold">Chỉnh Sửa Kinh Nghiệm</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
        {data && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Kinh Nghiệm Làm Việc</h2>
                <p className="text-muted-foreground">Quản lý lịch sử công việc</p>
              </div>
              <Button onClick={handleAddExperience} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm Mới
              </Button>
            </div>

            {data.experiences.map((exp, index) => (
              <Card key={exp.id} className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">#{index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExperience(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Chức Vụ
                      </label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          handleExperienceChange(index, 'position', e.target.value)
                        }
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Công Ty
                      </label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(index, 'company', e.target.value)
                        }
                        className="border-border"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Ngày Bắt Đầu
                      </label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleExperienceChange(index, 'startDate', e.target.value)
                        }
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Ngày Kết Thúc
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={exp.endDate || ''}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              'endDate',
                              e.target.value || null
                            )
                          }
                          disabled={exp.isCurrent}
                          className="border-border"
                        />
                        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={(e) =>
                              handleExperienceChange(index, 'isCurrent', e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                          Hiện Tại
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mô Tả
                    </label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleExperienceChange(index, 'description', e.target.value)
                      }
                      rows={4}
                      className="border-border resize-none"
                    />
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
