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
import { ArrowLeft, Save, Loader2, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

interface ProfSkill {
  title: string
  desc: string
  badges: string[]
}

export default function EditProfSkillsPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [skills, setSkills] = useState<ProfSkill[]>([])

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
      const response = await fetch('/api/data?type=prof_skills')
      if (response.ok) {
        const fetchedData = await response.json()
        setSkills(fetchedData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleSkillChange = (index: number, field: string, value: any) => {
    const updated = [...skills]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    setSkills(updated)
  }

  const handleAddBadge = (index: number, badge: string) => {
    if (!badge.trim()) return
    const updated = [...skills]
    if (!updated[index].badges.includes(badge.trim())) {
      updated[index].badges.push(badge.trim())
      setSkills(updated)
    }
  }

  const handleRemoveBadge = (skillIndex: number, badgeIndex: number) => {
    const updated = [...skills]
    updated[skillIndex].badges = updated[skillIndex].badges.filter((_, i) => i !== badgeIndex)
    setSkills(updated)
  }

  const handleAddSkill = () => {
    setSkills([
      ...skills,
      {
        title: '',
        desc: '',
        badges: [],
      },
    ])
  }

  const handleDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'prof_skills',
          data: skills,
        }),
      })

      if (response.ok) {
        toast.success('Kỹ năng chuyên môn đã được cập nhật')
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
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Chỉnh Sửa Kỹ Năng Chuyên Môn</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Kỹ Năng Chuyên Môn</h2>
                <p className="text-muted-foreground">Quản lý các nhóm kỹ năng chuyên môn chính</p>
              </div>
              <Button onClick={handleAddSkill} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm Nhóm Kỹ Năng
              </Button>
            </div>

            {skills.map((skill, skillIdx) => (
              <Card key={skillIdx} className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Nhóm Kỹ Năng #{skillIdx + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skillIdx)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tiêu Đề</label>
                    <Input
                      value={skill.title}
                      onChange={(e) => handleSkillChange(skillIdx, 'title', e.target.value)}
                      placeholder="VD: Quản Lý Dự Án"
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mô Tả</label>
                    <Textarea
                      value={skill.desc}
                      onChange={(e) => handleSkillChange(skillIdx, 'desc', e.target.value)}
                      placeholder="Mô tả tóm tắt về nhóm kỹ năng này..."
                      rows={3}
                      className="border-border resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags / Badges</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skill.badges.map((badge, badgeIdx) => (
                        <Badge key={badgeIdx} variant="secondary" className="gap-1 pr-1">
                          {badge}
                          <button
                            onClick={() => handleRemoveBadge(skillIdx, badgeIdx)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Thêm tag mới..."
                        className="border-border"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddBadge(skillIdx, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <Button 
                        variant="secondary"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleAddBadge(skillIdx, input.value)
                          input.value = ''
                        }}
                      >
                        Thêm
                      </Button>
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
        </main>
      </div>
    </div>
  )
}
