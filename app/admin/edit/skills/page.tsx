'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ArrowLeft, Save, Loader2, Plus, Trash2, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'

interface Skill {
  id: number
  name: string
  proficiency: number
  category: string
}

interface SkillsData {
  skills: Skill[]
}

export default function SkillsEditorPage() {
  const { data: session } = useSession()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 50,
    category: 'Thiết kế',
  })

  const categories = ['Thiết kế', 'Office', 'Quản lý', 'Khác']

  useEffect(() => {
    if (!session) {
      redirect('/admin/login')
    }

    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/data?type=skills')
        if (response.ok) {
          const data: SkillsData = await response.json()
          setSkills(data.skills)
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
        toast.error('Lỗi khi tải kỹ năng')
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [session])

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error('Vui lòng nhập tên kỹ năng')
      return
    }

    const skill: Skill = {
      id: Math.max(...skills.map(s => s.id), 0) + 1,
      name: newSkill.name,
      proficiency: newSkill.proficiency,
      category: newSkill.category,
    }

    setSkills([...skills, skill])
    setNewSkill({ name: '', proficiency: 50, category: 'Thiết kế' })
    toast.success('Đã thêm kỹ năng mới')
  }

  const handleUpdateSkill = (id: number, field: string, value: any) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const handleDeleteSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id))
    toast.success('Đã xóa kỹ năng')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'skills',
          data: { skills },
        }),
      })

      if (response.ok) {
        toast.success('Kỹ năng đã được cập nhật thành công')
      } else {
        toast.error('Lỗi khi cập nhật kỹ năng')
      }
    } catch (error) {
      console.error('Error saving skills:', error)
      toast.error('Lỗi khi lưu dữ liệu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold">Quản Lý Kỹ Năng Phần Mềm</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
          <div className="space-y-8">
            {/* Add New Skill */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Thêm Kỹ Năng Mới</CardTitle>
                <CardDescription>Nhập thông tin kỹ năng mới để thêm vào danh sách</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tên Kỹ Năng</label>
                      <Input
                        placeholder="ví dụ: AutoCAD"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Danh Mục</label>
                      <select
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trình Độ (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={newSkill.proficiency}
                        onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddSkill} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm Kỹ Năng
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills List */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Danh Sách Kỹ Năng ({skills.length})</CardTitle>
                <CardDescription>Quản lý và chỉnh sửa các kỹ năng hiện có</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : skills.length > 0 ? (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="p-4 border border-border rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tên</label>
                            <Input
                              value={skill.name}
                              onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Danh Mục</label>
                            <select
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                              value={skill.category}
                              onChange={(e) => handleUpdateSkill(skill.id, 'category', e.target.value)}
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Trình Độ (%)</label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={skill.proficiency}
                                onChange={(e) => handleUpdateSkill(skill.id, 'proficiency', parseInt(e.target.value))}
                              />
                              <span className="text-sm font-semibold text-muted-foreground w-8">
                                {skill.proficiency}%
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </Button>
                        </div>

                        {/* Progress Bar Preview */}
                        <div className="space-y-2 pt-2">
                          <p className="text-xs text-muted-foreground">Xem trước</p>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-8">
                    <p className="text-muted-foreground">Chưa có kỹ năng nào. Thêm kỹ năng mới ở trên.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            {!loading && (
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="lg"
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang Lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu Thay Đổi
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
