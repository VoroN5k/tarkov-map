'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SquadMarker, MarkerType } from '@/types'

export function useSquadMarkers(squadId: string | null, mapId: string) {
  const [markers, setMarkers] = useState<SquadMarker[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const fetchMarkers = useCallback(async () => {
    if (!squadId) { setMarkers([]); return }
    setLoading(true)
    const { data } = await supabase
      .from('squad_markers')
      .select('*, created_by:profiles(username)')
      .eq('squad_id', squadId)
      .eq('map_id', mapId)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
    setLoading(false)
    if (data) setMarkers(data as unknown as SquadMarker[])
  }, [squadId, mapId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMarkers()
  }, [fetchMarkers])

  // Realtime subscription
  useEffect(() => {
    if (!squadId) return

    const channel = supabase
      .channel(`squad-markers:${squadId}:${mapId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'squad_markers',
          filter: `squad_id=eq.${squadId}`,
        },
        async (payload) => {
          const newMarker = payload.new as SquadMarker
          if (newMarker.mapId !== mapId && (newMarker as any).map_id !== mapId) return
          // Fetch with joined profile
          const { data } = await supabase
            .from('squad_markers')
            .select('*, created_by:profiles(username)')
            .eq('id', newMarker.id)
            .single()
          if (data) setMarkers((prev) => [data as unknown as SquadMarker, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'squad_markers',
          filter: `squad_id=eq.${squadId}`,
        },
        (payload) => {
          const deleted = payload.old as { id: string }
          setMarkers((prev) => prev.filter((m) => m.id !== deleted.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [squadId, mapId]) // eslint-disable-line react-hooks/exhaustive-deps

  const addMarker = useCallback(
    async (params: { type: MarkerType; label: string; lat: number; lng: number }) => {
      if (!squadId) return null
      const res = await fetch('/api/markers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, squadId, mapId }),
      })
      if (res.ok) {
        // Refetch immediately so marker appears without waiting for Realtime
        await fetchMarkers()
        return res.json().catch(() => null)
      }
      return null
    },
    [squadId, mapId, fetchMarkers]
  )

  const removeMarker = useCallback(async (markerId: string) => {
    await fetch(`/api/markers/${markerId}`, { method: 'DELETE' })
  }, [])

  return { markers, loading, addMarker, removeMarker }
}
