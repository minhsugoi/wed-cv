'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export interface Skill {
  id: number
  name: string
  proficiency: number
  category: string
}

interface SkillsProgressProps {
  skills: Skill[]
  showCategory?: boolean
}

export function SkillsProgress({ skills, showCategory = true }: SkillsProgressProps) {
  const groupedSkills = showCategory
    ? skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
      }, {} as Record<string, Skill[]>)
    : { 'Tất cả': skills }

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          {showCategory && (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{category}</h3>
              <Badge variant="outline" className="ml-auto font-medium">
                {categorySkills.length} kỹ năng
              </Badge>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm font-semibold text-primary">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    transition={{ 
                      duration: 1.2, 
                      ease: [0.165, 0.84, 0.44, 1], // easeOutQuart 
                      delay: 0.1
                    }}
                    viewport={{ once: true }}
                  />
                  {/* Subtle shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      repeatDelay: 3
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
