'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

import { motion } from 'framer-motion'

export function Header() {
  const pathname = usePathname()
  const { data: sessionData } = useSession()
  
  const navItems = [
    { label: 'Giới Thiệu', href: '/' },
    { label: 'Kinh Nghiệm', href: '/experience' },
    { label: 'Dự Án', href: '/projects' },
    { label: 'Mục Tiêu', href: '/goals' },
    { label: 'Liên Hệ', href: '/contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    return pathname.startsWith(href) && href !== '/'
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
      suppressHydrationWarning
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6" suppressHydrationWarning>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            CP
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">
            Hồ Sơ Chuyên Gia
          </span>
        </Link>

        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                size="sm"
                className="text-sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {sessionData ? (
            <>
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                Đăng Xuất
              </Button>
            </>
          ) : (
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Đăng Nhập
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border">
        <nav className="flex gap-1 px-4 py-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                size="sm"
                className="text-xs whitespace-nowrap"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
