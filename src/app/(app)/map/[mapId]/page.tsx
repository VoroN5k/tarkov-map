import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MAPS } from '@/lib/map/maps.config'
import { getStaticMarkers } from '@/lib/map/static-markers'
import { MapClientShell } from './client'

export default async function MapPage({
  params,
}: {
  params: Promise<{ mapId: string }>
}) {
  const { mapId } = await params

  const config = MAPS[mapId]
  if (!config) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const staticMarkers = await getStaticMarkers(mapId)

  return (
    <MapClientShell
      config={config}
      staticMarkers={staticMarkers}
      currentUserId={user.id}
    />
  )
}

export function generateStaticParams() {
  return Object.keys(MAPS).map((mapId) => ({ mapId }))
}
