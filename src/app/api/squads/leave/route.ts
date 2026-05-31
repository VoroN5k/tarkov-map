import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const member = await prisma.squadMember.findFirst({
    where: { userId: user.id },
    include: { squad: { include: { members: true } } },
    orderBy: { joinedAt: 'desc' },
  })

  if (!member) return NextResponse.json({ error: 'Ви не в жодному загоні' }, { status: 404 })

  await prisma.squadMember.delete({
    where: { squadId_userId: { squadId: member.squadId, userId: user.id } },
  })

  // Delete squad if it's now empty
  const remaining = await prisma.squadMember.count({
    where: { squadId: member.squadId },
  })
  if (remaining === 0) {
    await prisma.squad.delete({ where: { id: member.squadId } })
  }

  return NextResponse.json({ ok: true })
}
