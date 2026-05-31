import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { MarkerType } from '@/types'

const VALID_TYPES: MarkerType[] = ['ENEMY', 'LOOT', 'MEETING', 'DANGER', 'CUSTOM']

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { type, label, lat, lng, squadId, mapId } = body

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Невірний тип мітки' }, { status: 400 })
  }
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'Невірні координати' }, { status: 400 })
  }
  if (!squadId || !mapId) {
    return NextResponse.json({ error: 'Потрібен squadId та mapId' }, { status: 400 })
  }

  // Verify user is in this squad
  const membership = await prisma.squadMember.findUnique({
    where: { squadId_userId: { squadId, userId: user.id } },
  })
  if (!membership) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  const marker = await prisma.squadMarker.create({
    data: {
      type,
      label: label || null,
      lat,
      lng,
      squadId,
      mapId,
      createdById: user.id,
      expiresAt,
    },
  })

  return NextResponse.json(marker, { status: 201 })
}
