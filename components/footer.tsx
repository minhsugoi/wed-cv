'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export function Footer() {
  const [contactInfo, setContactInfo] = useState({
    email: 'contact@example.com',
    phone: '+84 (0) 123 456 789',
    location: 'Thành phố Hồ Chí Minh, Việt Nam',
  })

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const response = await fetch('/api/data?type=introduction')
        if (response.ok) {
          const data = await response.json()
          setContactInfo({
            email: data.email,
            phone: data.phone,
            location: data.location,
          })
        }
      } catch (error) {
        console.error('Error fetching contact info:', error)
      }
    }

    fetchIntro()
  }, [])

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <Link href="/contact" className="hover:opacity-80 transition-opacity">
              <h3 className="text-lg font-semibold text-foreground">Liên Hệ</h3>
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
              <Phone className="w-4 h-4" />
              <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}>{contactInfo.phone}</a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
              <MapPin className="w-4 h-4" />
              <span>{contactInfo.location}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Khám Phá</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition">Giới Thiệu</Link></li>
              <li><Link href="/experience" className="hover:text-foreground transition">Kinh Nghiệm</Link></li>
              <li><Link href="/projects" className="hover:text-foreground transition">Dự Án</Link></li>
              <li><Link href="/goals" className="hover:text-foreground transition">Mục Tiêu</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Hỗ Trợ</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground transition">Gửi Thư</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">Chính Sách Riêng Tư</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">Điều Khoản Sử Dụng</Link></li>
            </ul>
          </div>
        </div>

        <Separator />

        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Phùng Ngọc Minh | Portfolio. Bản quyền được bảo vệ.</p>
          <p>Thiết kế và phát triển bởi <span className="text-foreground font-medium">Ngọc Minh</span></p>
        </div>
      </div>
    </footer>
  )
}
