import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const username = (body.username as string)?.trim()
  if (!username || username.length < 3) {
    return NextResponse.json({ error: 'Невірний нікнейм' }, { status: 400 })
  }

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, username },
    update: {},
  })

  return NextResponse.json(profile)
}
