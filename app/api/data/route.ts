import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSupabaseClient } from '@/lib/supabase'

const ALLOWED_TYPES = new Set([
  'introduction',
  'experience',
  'projects',
  'skills',
  'goals',
  'images',
  'prof_skills',
  'inquiries',
])

const SELECT_BY_TYPE: Record<string, string> = {
  introduction:
    'id, full_name, title, specializations, bio, email, phone, location, profile_image',
  experience:
    'id, position, company, start_date, end_date, is_current, description',
  projects:
    'id, title, description, role, duration, budget, team, image, outcomes',
  skills: 'id, name, proficiency, category',
  goals: 'id, title, description, timeline',
  images: 'id, name, url',
  prof_skills: 'title, description, badges',
  inquiries: 'id, name, email, subject, message, created_at',
}

function mapGetResult(type: string, data: any[]) {
  if (type === 'introduction') {
    const intro = data[0] || {}
    return {
      fullName: intro.full_name,
      title: intro.title,
      specializations: intro.specializations,
      bio: intro.bio,
      email: intro.email,
      phone: intro.phone,
      location: intro.location,
      profileImage: intro.profile_image,
    }
  }

  if (['experience', 'projects', 'skills', 'goals', 'images'].includes(type)) {
    const key =
      type === 'experience'
        ? 'experiences'
        : type === 'images'
          ? 'images'
          : type === 'goals'
            ? 'goals'
            : type === 'projects'
              ? 'projects'
              : 'skills'

    const mappedData =
      type === 'experience'
        ? data.map((item: any) => ({
            ...item,
            startDate: item.start_date,
            endDate: item.end_date,
            isCurrent: item.is_current,
          }))
        : data

    return { [key]: mappedData }
  }

  if (type === 'prof_skills') {
    return data.map((item: any) => ({
      title: item.title,
      desc: item.description,
      badges: item.badges,
    }))
  }

  if (type === 'inquiries') {
    return data.map((item: any) => ({
      id: item.id?.toString?.() ?? String(item.id),
      name: item.name,
      email: item.email,
      phone: item.subject,
      message: item.message,
      submittedAt: item.created_at,
    }))
  }

  return data
}

async function deleteMissingIds(
  supabase: ReturnType<typeof getSupabaseClient>,
  table: string,
  keepIds: (string | number)[]
) {
  const { data: existing, error } = await supabase
    .from(table)
    .select('id')

  if (error) throw error

  const existingIds = (existing || []).map((row: any) => row.id)
  const keepSet = new Set(keepIds.map((id) => id.toString()))
  const toDelete = existingIds.filter(
    (id: any) => !keepSet.has(id?.toString?.() ?? String(id))
  )

  if (toDelete.length === 0) return

  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .in('id', toDelete)

  if (deleteError) throw deleteError
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type || !ALLOWED_TYPES.has(type)) {
      return NextResponse.json(
        { error: 'Invalid or missing type parameter' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    let query = supabase
      .from(type)
      .select(SELECT_BY_TYPE[type] || '*')
      .order('id', { ascending: true })

    if (type === 'introduction') {
      query = query.limit(1)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(mapGetResult(type, data || []))
  } catch (error: any) {
    console.error('Error reading data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to read data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { type, data } = await request.json()

    if (!type || !data || !ALLOWED_TYPES.has(type)) {
      return NextResponse.json(
        { error: 'Invalid or missing type/data' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    let dataToInsert = []

    if (type === 'experience') {
      dataToInsert = data.experiences.map((exp: any) => ({
        id: exp.id,
        position: exp.position,
        company: exp.company,
        start_date: exp.startDate,
        end_date: exp.endDate,
        is_current: exp.isCurrent,
        description: exp.description
      }))
    } else if (type === 'goals') {
      dataToInsert = data.goals
    } else if (type === 'images') {
      dataToInsert = data.images
    } else if (type === 'introduction') {
      dataToInsert = [{
        id: 1,
        full_name: data.fullName,
        title: data.title,
        specializations: data.specializations,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
        location: data.location,
        profile_image: data.profileImage
      }]
    } else if (type === 'prof_skills') {
      dataToInsert = data.map((skill: any) => ({
        title: skill.title,
        description: skill.desc,
        badges: skill.badges
      }))
    } else if (type === 'projects') {
      dataToInsert = data.projects.map((proj: any) => ({
        id: proj.id,
        title: proj.title,
        description: proj.description,
        role: proj.role,
        duration: proj.duration,
        budget: proj.budget,
        team: proj.team,
        image: proj.image,
        outcomes: proj.outcomes
      }))
    } else if (type === 'skills') {
      dataToInsert = data.skills
    } else if (type === 'inquiries') {
      // Only support deletions from admin (no edits), based on current UI behavior.
      const incoming = Array.isArray(data.inquiries) ? data.inquiries : []
      const keepIds = incoming.map((item: any) => item.id).filter(Boolean)
      await deleteMissingIds(supabase, 'inquiries', keepIds)
      return NextResponse.json({ success: true })
    } else {
      dataToInsert = Array.isArray(data) ? data : [data]
    }

    if (type === 'prof_skills') {
      // Replace-all strategy for tables without stable ids.
      const { error: deleteError } = await supabase
        .from(type)
        .delete()
        .neq('title', '__never__')
      if (deleteError) throw deleteError
    } else if (type !== 'introduction') {
      if (dataToInsert.length === 0) {
        const { error: deleteError } = await supabase
          .from(type)
          .delete()
          .neq('id', -1)
        if (deleteError) throw deleteError
      } else {
        const keepIds = dataToInsert.map((item: any) => item.id).filter(Boolean)
        if (keepIds.length > 0) {
          await deleteMissingIds(supabase, type, keepIds)
        }
      }
    }

    const { error } = await supabase
      .from(type)
      .upsert(dataToInsert, type === 'prof_skills' ? undefined : { onConflict: 'id' })

    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error writing data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to write data' },
      { status: 500 }
    )
  }
}
