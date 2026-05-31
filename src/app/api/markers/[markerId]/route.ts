import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ markerId: string }> }
) {
  const { markerId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const marker = await prisma.squadMarker.findUnique({ where: { id: markerId } })
  if (!marker) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (marker.createdById !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.squadMarker.delete({ where: { id: markerId } })
  return NextResponse.json({ ok: true })
}
