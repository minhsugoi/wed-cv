'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ArrowLeft, Mail, Phone, Calendar, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  submittedAt: string
}

export default function InquiriesPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState(true)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login')
    }

    if (status === 'authenticated') {
      fetchInquiries()
    }
  }, [status])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setInquiries(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      toast.error('Không thể tải yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa yêu cầu này?')) return

    try {
      const updatedInquiries = inquiries.filter((inq) => inq.id !== id)
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'inquiries',
          data: { inquiries: updatedInquiries },
        }),
      })

      if (response.ok) {
        setInquiries(updatedInquiries)
        toast.success('Yêu cầu đã được xóa')
      } else {
        toast.error('Lỗi khi xóa')
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      toast.error('Lỗi khi xóa')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
            <h1 className="text-xl font-bold">Các Yêu Cầu Liên Hệ</h1>
          </div>
        </header>

        {/* Main Content */}
      <main className="container max-w-6xl px-4 md:px-6 py-12">
        {inquiries.length === 0 ? (
          <Card className="border-border text-center">
            <CardContent className="pt-12 pb-12">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Chưa Có Yêu Cầu</h3>
              <p className="text-muted-foreground">
                Hiện chưa có yêu cầu liên hệ nào từ khách hàng
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Tổng {inquiries.length} yêu cầu</h2>
                <p className="text-muted-foreground">
                  Danh sách các yêu cầu từ khách hàng
                </p>
              </div>
            </div>

            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="hover:text-primary transition"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="hover:text-primary transition"
                            >
                              {inquiry.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(inquiry.submittedAt)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(inquiry.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
