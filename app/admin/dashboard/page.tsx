'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminSidebar } from '@/components/admin-sidebar'
import { signOut } from 'next-auth/react'
import {
  User,
  Briefcase,
  FolderOpen,
  Target,
  Mail,
  Zap,
  LogOut,
  Image as ImageIcon,
} from 'lucide-react'

const menuItems = [
  {
    label: 'Giới Thiệu',
    href: '/admin/edit/introduction',
    icon: User,
    description: 'Chỉnh sửa thông tin giới thiệu cá nhân',
  },
  {
    label: 'Kinh Nghiệm',
    href: '/admin/edit/experience',
    icon: Briefcase,
    description: 'Quản lý kinh nghiệm làm việc',
  },
  {
    label: 'Kỹ Năng Phần Mềm',
    href: '/admin/edit/skills',
    icon: Zap,
    description: 'Quản lý kỹ năng phần mềm và trình độ',
  },
  {
    label: 'Dự Án',
    href: '/admin/edit/projects',
    icon: FolderOpen,
    description: 'Quản lý dự án hoàn thành',
  },
  {
    label: 'Mục Tiêu',
    href: '/admin/edit/goals',
    icon: Target,
    description: 'Quản lý mục tiêu sự nghiệp',
  },
  {
    label: 'Các Yêu Cầu',
    href: '/admin/inquiries',
    icon: Mail,
    description: 'Xem các yêu cầu liên hệ từ khách',
  },
  {
    label: 'Hình Ảnh',
    href: '/admin/edit/images',
    icon: ImageIcon,
    description: 'Quản lý kho hình ảnh và tải lên',
  },
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalInquiries: 0,
    experiences: 0,
    projects: 0,
    skills: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login')
    }

    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      const [inquiriesRes, experienceRes, projectsRes, skillsRes] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/data?type=experience'),
        fetch('/api/data?type=projects'),
        fetch('/api/data?type=skills'),
      ])

      const inquiries = await inquiriesRes.json()
      const experience = await experienceRes.json()
      const projects = await projectsRes.json()
      const skills = await skillsRes.json()

      setStats({
        totalInquiries: Array.isArray(inquiries) ? inquiries.length : 0,
        experiences: experience.experiences?.length || 0,
        projects: projects.projects?.length || 0,
        skills: skills.skills?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
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
            <h1 className="text-xl font-bold">Bảng Điều Khiển</h1>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground hidden sm:block">
                {session?.user?.name || 'Admin'}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tighter mb-2">
            Xin Chào, {session?.user?.name || 'Admin'}!
          </h2>
          <p className="text-lg text-muted-foreground">
            Quản lý nội dung của hồ sơ chuyên gia của bạn
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Yêu Cầu Mới</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.totalInquiries}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Yêu cầu liên hệ chưa xử lý
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Kinh Nghiệm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.experiences}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bản ghi kinh nghiệm làm việc
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Dự Án</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.projects}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dự án hoàn thành
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div>
          <h3 className="text-xl font-bold mb-6">Quản Lý Nội Dung</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">{item.label}</CardTitle>
                          <CardDescription className="text-sm">
                            {item.description}
                          </CardDescription>
                        </div>
                        <IconComponent className="w-5 h-5 text-primary mt-1" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 rounded-lg bg-accent/5 border border-border">
          <h4 className="font-semibold mb-2">Cần Hỗ Trợ?</h4>
          <p className="text-sm text-muted-foreground">
            Nhấp vào menu bên trái để bắt đầu chỉnh sửa nội dung. Tất cả các thay đổi sẽ được lưu tự động.
          </p>
        </div>
        </main>
      </div>
    </div>
  )
}
