import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const inviteCode = (body.inviteCode as string)?.trim().toUpperCase()
  if (!inviteCode) return NextResponse.json({ error: 'Потрібен код запрошення' }, { status: 400 })

  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, username: user.email!.split('@')[0] },
    update: {},
  })

  const squad = await prisma.squad.findUnique({
    where: { inviteCode },
  })

  if (!squad) return NextResponse.json({ error: 'Загін не знайдено' }, { status: 404 })

  const existing = await prisma.squadMember.findUnique({
    where: { squadId_userId: { squadId: squad.id, userId: user.id } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Ви вже в цьому загоні' }, { status: 409 })
  }

  await prisma.squadMember.create({
    data: { squadId: squad.id, userId: user.id, role: 'MEMBER' },
  })

  const updated = await prisma.squad.findUnique({
    where: { id: squad.id },
    include: {
      members: { include: { user: { select: { username: true, avatarUrl: true } } } },
    },
  })

  return NextResponse.json(updated)
}
