import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const name = (body.name as string)?.trim()
  if (!name || name.length < 1 || name.length > 32) {
    return NextResponse.json({ error: 'Невірна назва загону' }, { status: 400 })
  }

  // Ensure profile exists
  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, username: user.email!.split('@')[0] },
    update: {},
  })

  const inviteCode = nanoid(6).toUpperCase()

  const squad = await prisma.squad.create({
    data: {
      name,
      inviteCode,
      ownerId: user.id,
      members: {
        create: { userId: user.id, role: 'OWNER' },
      },
    },
    include: {
      members: { include: { user: { select: { username: true, avatarUrl: true } } } },
    },
  })

  return NextResponse.json(squad, { status: 201 })
}
