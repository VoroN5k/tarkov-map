import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const member = await prisma.squadMember.findFirst({
    where: { userId: user.id },
    include: {
      squad: {
        include: {
          members: { include: { user: { select: { username: true, avatarUrl: true } } } },
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  })

  if (!member) return NextResponse.json(null, { status: 404 })

  return NextResponse.json(member.squad)
}
