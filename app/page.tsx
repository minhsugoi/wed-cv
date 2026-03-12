'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building2, Award, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

interface IntroductionData {
  fullName: string
  title: string
  specializations: string[]
  bio: string
  email: string
  phone: string
  location: string
  profileImage: string
}

export default function Home() {
  const [intro, setIntro] = useState<IntroductionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        const response = await fetch('/api/data?type=introduction')
        if (response.ok) {
          const data = await response.json()
          setIntro(data)
        }
      } catch (error) {
        console.error('Error fetching introduction:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIntroduction()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-b border-border">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-6">
                    {intro?.profileImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="md:hidden w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 shrink-0"
                      >
                        <img 
                          src={intro.profileImage} 
                          alt={intro.fullName} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground"
                    >
                      {intro?.fullName}
                    </motion.h1>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl text-primary font-semibold"
                  >
                    {intro?.title}
                  </motion.p>
                </div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-lg text-muted-foreground leading-relaxed max-w-xl"
                >
                  {intro?.bio}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  {intro?.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-sm">
                      {spec}
                    </Badge>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link href="/projects">
                    <Button size="lg" className="gap-2">
                      Xem Dự Án <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="gap-2">
                      Liên Hệ Tôi <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0, 0.71, 0.2, 1.01] }}
                className="hidden md:flex items-center justify-center"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full aspect-video md:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-border flex items-center justify-center overflow-hidden shadow-2xl"
                >
                  {intro?.profileImage ? (
                    <img 
                      src={intro.profileImage} 
                      alt={intro.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-32 h-32 text-primary/40" />
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="w-full py-12 md:py-20 lg:py-28">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <div className="grid gap-6 md:grid-cols-3">
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border border-border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6 text-primary" />
                        <CardTitle className="text-sm">Kinh Nghiệm</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary mb-2">10+</p>
                      <p className="text-sm text-muted-foreground">
                        năm kinh nghiệm trong ngành xây dựng
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border border-border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        <CardTitle className="text-sm">Dự Án</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary mb-2">50+</p>
                      <p className="text-sm text-muted-foreground">
                        dự án xây dựng đã hoàn thành
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border border-border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-6 h-6 text-primary" />
                        <CardTitle className="text-sm">Đội Ngũ</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary mb-2">100+</p>
                      <p className="text-sm text-muted-foreground">
                        nhân viên được quản lý trực tiếp
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-20 bg-accent/5 border-y border-border">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Bạn Có Dự Án Cần Hỗ Trợ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tôi luôn sẵn sàng thảo luận về các cơ hội hợp tác và phát triển dự án xây dựng mới.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="gap-2">
                    Bắt Đầu Hợp Tác <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/experience">
                  <Button variant="outline" size="lg">
                    Xem Kinh Nghiệm
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
