'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, TrendingUp, Award, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

interface Goal {
  id: number
  title: string
  description: string
  timeline: string
}

interface GoalsData {
  goals: Goal[]
}

const goalIcons = [Lightbulb, TrendingUp, Award, Zap]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/data?type=goals')
        if (response.ok) {
          const data: GoalsData = await response.json()
          setGoals(data.goals)
        }
      } catch (error) {
        console.error('Error fetching goals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGoals()
  }, [])

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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Mục Tiêu Sự Nghiệp</h1>
              <p className="text-lg text-muted-foreground">
                Các mục tiêu phát triển và hướng đi trong tương lai
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {goals.map((goal, index) => {
                  const IconComponent = goalIcons[index % goalIcons.length]
                  return (
                    <motion.div 
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border border-border hover:border-primary/50 transition-colors group h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <motion.div 
                              whileHover={{ rotate: 15 }}
                              className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                            >
                              <IconComponent className="w-6 h-6 text-primary" />
                            </motion.div>
                            <Badge variant="secondary" className="text-xs">
                              {goal.timeline}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mt-4">{goal.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {goal.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Development Plan Section */}
        <section className="w-full py-12 md:py-20 bg-accent/5">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter mb-8">Kế Hoạch Phát Triển</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Ngắn Hạn (2024)", goals: ["Hoàn thiện kỹ năng BIM", "Lãnh đạo dự án quy mô lớn", "Nâng cao trình độ quản lý"] },
                  { title: "Trung Hạn (2024-2026)", goals: ["Tham gia dự án xanh", "Mở rộng mạng lưới chuyên gia", "Phát triển kỹ năng lãnh đạo"] },
                  { title: "Dài Hạn (2026-2028)", goals: ["Quản lý dự án hạ tầng", "Chuyên gia công nghệ xây dựng", "Đóng góp cho ngành"] }
                ].map((plan, idx) => (
                  <motion.div key={idx} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="border border-border h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm text-foreground">Mục Tiêu Chính:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            {plan.goals.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Commitment Section */}
        <section className="w-full py-12 md:py-20">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter mb-8">Cam Kết Phát Triển</h2>
              <div className="space-y-4">
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <p className="text-foreground leading-relaxed">
                        Tôi cam kết không ngừng học tập và phát triển bản thân để cung cấp các giải pháp xây dựng tốt nhất. Mục tiêu của tôi là trở thành chuyên gia hàng đầu trong ngành, đóng góp tích cực vào sự phát triển của các công trình xây dựng bền vững.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <p className="text-foreground leading-relaxed">
                        Thông qua việc áp dụng công nghệ tiên tiến, tôi sẽ tiếp tục cải thiện hiệu quả quản lý dự án, đảm bảo chất lượng cao và tuân thủ các tiêu chuẩn quốc tế trong mỗi công trình.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
