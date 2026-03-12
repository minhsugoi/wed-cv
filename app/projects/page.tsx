'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Users, Target, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface Project {
  id: number
  title: string
  description: string
  role: string
  duration: string
  budget: string
  team: string
  outcomes: string[]
  image?: string
}

interface ProjectsData {
  projects: Project[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/data?type=projects')
        if (response.ok) {
          const data: ProjectsData = await response.json()
          setProjects(data.projects)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
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
              className="space-y-2 mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Dự Án Nổi Bật</h1>
              <p className="text-lg text-muted-foreground">
                Các công trình xây dựng đã hoàn thành và các giải pháp tiên tiến
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-8">
                {projects.map((project, index) => (
                  <ScrollReveal key={project.id}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors bg-card"
                    >
                      <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Project Image */}
                        <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden min-h-[300px] md:min-h-full">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-full h-full flex items-center justify-center"
                              >
                                <Target className="w-24 h-24 text-primary/20" />
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-2">
                                {project.title}
                              </h3>
                              <Badge className="bg-primary/20 text-primary">
                                {project.role}
                              </Badge>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                              {project.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Thời Gian</p>
                                <p className="font-semibold text-foreground">{project.duration}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  Ngân Sách
                                </p>
                                <p className="font-semibold text-foreground">{project.budget}</p>
                              </div>
                            </div>
                          </div>

                          {/* Outcomes */}
                          <div className="space-y-3">
                            <p className="font-semibold text-foreground text-sm">Kết Quả Đạt Được:</p>
                            <ul className="space-y-2">
                              {project.outcomes.map((outcome, idx) => (
                                <motion.li 
                                  key={idx} 
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * idx }}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{outcome}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Project Statistics */}
        <section className="w-full py-12 md:py-20 bg-accent/5">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter mb-8">Thống Kê Dự Án</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: "Tổng Dự Án", val: projects.length, sub: "" },
                  { title: "Giá Trị Dự Án", val: "780+", sub: "Tỷ đồng" },
                  { title: "Diện Tích Xây Dựng", val: "55,000+", sub: "m²" },
                  { title: "Tỷ Lệ Hoàn Thành", val: "100%", sub: "Đúng tiến độ" }
                ].map((stat, idx) => (
                  <motion.div key={idx} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-sm">{stat.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-primary">{stat.val}</p>
                        {stat.sub && <p className="text-xs text-muted-foreground">{stat.sub}</p>}
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
