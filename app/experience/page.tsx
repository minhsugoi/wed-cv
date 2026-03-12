'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkillsProgress, Skill } from '@/components/skills-progress'
import { Briefcase, Calendar, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

interface Experience {
  id: number
  position: string
  company: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
}

interface ExperienceData {
  experiences: Experience[]
}

interface SkillsData {
  skills: Skill[]
}

interface ProfSkill {
  title: string
  desc: string
  badges: string[]
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [profSkills, setProfSkills] = useState<ProfSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expResponse, skillsResponse, profSkillsResponse] = await Promise.all([
          fetch('/api/data?type=experience'),
          fetch('/api/data?type=skills'),
          fetch('/api/data?type=prof_skills'),
        ])
        
        if (expResponse.ok) {
          const data: ExperienceData = await expResponse.json()
          setExperiences(data.experiences)
        }
        
        if (skillsResponse.ok) {
          const data: SkillsData = await skillsResponse.json()
          setSkills(data.skills)
        }

        if (profSkillsResponse.ok) {
          const data: ProfSkill[] = await profSkillsResponse.json()
          setProfSkills(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
    })
  }

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0) {
      return remainingMonths > 0 ? `${years} năm ${remainingMonths} tháng` : `${years} năm`
    }
    return `${remainingMonths} tháng`
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
              className="space-y-2 mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Kinh Nghiệm Làm Việc</h1>
              <p className="text-lg text-muted-foreground">
                Hành trình sự nghiệp của tôi trong ngành xây dựng
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <motion.div 
                    key={exp.id} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Timeline line */}
                    {index < experiences.length - 1 && (
                      <div className="absolute left-6 top-20 bottom-0 w-px bg-border" />
                    )}

                    <div className="flex gap-6">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background z-10 relative ${
                          exp.isCurrent ? 'bg-primary text-primary-foreground' : 'bg-card border-border text-foreground'
                        }`}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Card className="border border-border">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <CardTitle className="text-xl">{exp.position}</CardTitle>
                                  <CardDescription className="text-base text-foreground/70">
                                    {exp.company}
                                  </CardDescription>
                                </div>
                                {exp.isCurrent && (
                                  <Badge className="bg-primary text-primary-foreground">
                                    Hiện Tại
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Nay'}
                                </span>
                                <span className="text-xs bg-accent/10 px-2 py-1 rounded">
                                  {calculateDuration(exp.startDate, exp.endDate)}
                                </span>
                              </div>
                              <p className="text-foreground leading-relaxed">
                                {exp.description}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Professional Skills Section */}
        <section className="w-full py-12 md:py-20 bg-accent/5">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter mb-8">Kỹ Năng Chuyên Môn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profSkills.map((skill, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Card className="border border-border h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{skill.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {skill.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {skill.badges.map((b) => (
                            <Badge key={b} variant="secondary">{b}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Software Skills Section */}
        <section className="w-full py-12 md:py-20 border-b border-border">
          <ScrollReveal>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tighter">Kỹ Năng Phần Mềm</h2>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Năng lực sử dụng các công cụ phần mềm chuyên ngành trong lĩnh vực xây dựng
                  </p>
                </div>

                {skills.length > 0 ? (
                  <SkillsProgress skills={skills} showCategory={true} />
                ) : (
                  <Card className="border border-border">
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">Đang tải kỹ năng...</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
