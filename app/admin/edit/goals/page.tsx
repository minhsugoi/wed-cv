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

interface Goal {
  id: number
  title: string
  description: string
  timeline: string
}

interface GoalsData {
  goals: Goal[]
}

export default function EditGoalsPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<GoalsData | null>(null)

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
      const response = await fetch('/api/data?type=goals')
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

  const handleGoalChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (!data) return

    const updated = [...data.goals]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }

    setData({ goals: updated })
  }

  const handleAddGoal = () => {
    if (!data) return

    const newId = Math.max(...data.goals.map((g) => g.id), 0) + 1

    setData({
      goals: [
        ...data.goals,
        {
          id: newId,
          title: '',
          description: '',
          timeline: '',
        },
      ],
    })
  }

  const handleDeleteGoal = (index: number) => {
    if (!data) return

    setData({
      goals: data.goals.filter((_, i) => i !== index),
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
          type: 'goals',
          data,
        }),
      })

      if (response.ok) {
        toast.success('Mục tiêu đã được cập nhật')
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
            <h1 className="text-xl font-bold">Quản Lý Mục Tiêu</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
        {data && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Mục Tiêu Sự Nghiệp</h2>
                <p className="text-muted-foreground">Quản lý các mục tiêu phát triển</p>
              </div>
              <Button onClick={handleAddGoal} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm Mục Tiêu
              </Button>
            </div>

            {data.goals.map((goal, index) => (
              <Card key={goal.id} className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">Mục Tiêu #{index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGoal(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Tiêu Đề
                    </label>
                    <Input
                      value={goal.title}
                      onChange={(e) =>
                        handleGoalChange(index, 'title', e.target.value)
                      }
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mô Tả
                    </label>
                    <Textarea
                      value={goal.description}
                      onChange={(e) =>
                        handleGoalChange(index, 'description', e.target.value)
                      }
                      rows={4}
                      className="border-border resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Thời Gian (Timeline)
                    </label>
                    <Input
                      value={goal.timeline}
                      onChange={(e) =>
                        handleGoalChange(index, 'timeline', e.target.value)
                      }
                      placeholder="2024-2026"
                      className="border-border"
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
