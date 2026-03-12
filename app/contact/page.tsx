'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    location: '',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Tin nhắn đã được gửi thành công!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
      } else {
        toast.error(result.error || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 border-b border-border">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2 mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Liên Hệ Với Tôi</h1>
              <p className="text-lg text-muted-foreground">
                Tôi luôn sẵn sàng tiếp nhận các yêu cầu hợp tác hoặc câu hỏi
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3 mb-12">
              {[
                { icon: Mail, title: "Email", val: contactInfo.email, href: `mailto:${contactInfo.email}` },
                { icon: Phone, title: "Điện Thoại", val: contactInfo.phone, href: `tel:${contactInfo.phone}` },
                { icon: MapPin, title: "Địa Điểm", val: contactInfo.location, href: null }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.3 }}
                >
                  <Card className="border border-border h-full hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.href ? (
                        <a href={item.href} className="text-primary hover:underline font-medium break-all">
                          {item.val}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{item.val}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="w-full py-12 md:py-20 bg-accent/5">
          <ScrollReveal>
            <div className="container mx-auto max-w-2xl px-4 md:px-6">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl">Gửi Tin Nhắn</CardTitle>
                  <CardDescription>
                    Vui lòng điền các thông tin dưới đây và tôi sẽ liên hệ với bạn sớm nhất có thể
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Họ và Tên *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Nguyễn Văn B"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Số Điện Thoại
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+84 (0) 123 456 789"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Tin Nhắn *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Nội dung tin nhắn của bạn..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="border-border resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                    </Button>

                    {submitted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm"
                      >
                        ✓ Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi trong thời gian sớm nhất.
                      </motion.div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-20">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter mb-8">Câu Hỏi Thường Gặp</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { q: "Thời gian phản hồi của bạn là bao lâu?", a: "Tôi thường phản hồi trong vòng 24-48 giờ. Trong những trường hợp khẩn cấp, vui lòng liên hệ trực tiếp qua số điện thoại." },
                  { q: "Bạn có chấp nhận dự án nhỏ không?", a: "Tôi sẵn sàng xem xét tất cả các dự án, từ nhỏ đến lớn. Vui lòng liên hệ để thảo luận chi tiết về yêu cầu của bạn." },
                  { q: "Bạn có công nghệ BIM không?", a: "Có, tôi có kinh nghiệm với công nghệ BIM và các phần mềm quản lý dự án hiện đại khác. Chúng tôi sẽ áp dụng công nghệ phù hợp nhất cho từng dự án." },
                  { q: "Phạm vi dịch vụ của bạn bao gồm những gì?", a: "Tôi cung cấp dịch vụ quản lý dự án, tư vấn kỹ thuật, kiểm soát chất lượng, và giám sát thi công. Vui lòng liên hệ để biết thêm chi tiết." }
                ].map((faq, idx) => (
                  <motion.div key={idx} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-base">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
