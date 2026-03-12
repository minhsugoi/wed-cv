'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Building2, 
  Target, 
  Mail, 
  Zap,
  Image as ImageIcon,
  LogOut 
} from 'lucide-react'

const menuItems = [
  {
    label: 'Bảng Điều Khiển',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Giới Thiệu',
    href: '/admin/edit/introduction',
    icon: User,
  },
  {
    label: 'Kinh Nghiệm',
    href: '/admin/edit/experience',
    icon: Briefcase,
  },
  {
    label: 'Kỹ Năng Phần Mềm',
    href: '/admin/edit/skills',
    icon: Zap,
  },
  {
    label: 'Kỹ Năng Chuyên Môn',
    href: '/admin/edit/prof-skills',
    icon: Briefcase,
  },
  {
    label: 'Dự Án',
    href: '/admin/edit/projects',
    icon: Building2,
  },
  {
    label: 'Mục Tiêu',
    href: '/admin/edit/goals',
    icon: Target,
  },
  {
    label: 'Liên Hệ',
    href: '/admin/inquiries',
    icon: Mail,
  },
  {
    label: 'Hình Ảnh',
    href: '/admin/edit/images',
    icon: ImageIcon,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Admin Panel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                size="sm"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          size="sm"
          onClick={() => signOut({ redirectTo: '/admin/login' })}
        >
          <LogOut className="w-4 h-4" />
          Đăng Xuất
        </Button>
      </div>
    </aside>
  )
}
