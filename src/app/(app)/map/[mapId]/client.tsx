'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { MapConfig, StaticMarker, MarkerType } from '@/types'
import { MapSelector } from '@/components/map/MapSelector'
import { LayerControl } from '@/components/map/LayerControl'
import { SquadPanel } from '@/components/squad/SquadPanel'
import { CreateSquadModal } from '@/components/squad/CreateSquadModal'
import { useSquad } from '@/lib/hooks/useSquad'
import { useSquadMarkers } from '@/lib/hooks/useSquadMarkers'
import { useMapLayers } from '@/lib/hooks/useMapLayers'

// Leaflet must not render on the server
const TarkovMap = dynamic(
  () => import('@/components/map/MapContainer').then((m) => m.TarkovMap),
  { ssr: false, loading: () => <div className="flex-1 bg-zinc-950 flex items-center justify-center text-zinc-500">Завантаження карти…</div> }
)

interface MapClientShellProps {
  config: MapConfig
  staticMarkers: {
    exits: StaticMarker[]
    spawns: StaticMarker[]
    bosses: StaticMarker[]
    loot: StaticMarker[]
  }
  currentUserId: string
}

export function MapClientShell({ config, staticMarkers, currentUserId }: MapClientShellProps) {
  const { squad, loading: squadLoading, createSquad, joinSquad, leaveSquad } = useSquad()
  const { markers: squadMarkers, addMarker, removeMarker } = useSquadMarkers(
    squad?.id ?? null,
    config.id
  )
  const { layers, toggleLayer } = useMapLayers()

  const [showSquadModal, setShowSquadModal] = useState(false)
  const [showPanel, setShowPanel] = useState(true)
  const [activePlacement, setActivePlacement] = useState<MarkerType | null>(null)
  const [markerLabel, setMarkerLabel] = useState('')

  const handlePlacementToggle = useCallback((type: MarkerType) => {
    setActivePlacement((prev) => (prev === type ? null : type))
  }, [])

  const handlePlace = useCallback(
    async (lat: number, lng: number) => {
      if (!activePlacement || !squad) return
      await addMarker({ type: activePlacement, label: markerLabel, lat, lng })
      setActivePlacement(null)
    },
    [activePlacement, squad, markerLabel, addMarker]
  )

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex-shrink-0 z-10">
        <Link href="/" className="text-amber-400 font-bold text-sm tracking-wider flex-shrink-0">
          🗺 TARKOV MAP
        </Link>
        <div className="h-4 w-px bg-zinc-700" />
        <MapSelector />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPanel((v) => !v)}
            className="px-3 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
          >
            {showPanel ? '✕ Загін' : '⚔ Загін'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map area */}
        <div className="flex-1 relative overflow-hidden">
          <TarkovMap
            config={config}
            layers={layers}
            staticMarkers={staticMarkers}
            squadMarkers={squad ? squadMarkers : []}
            currentUserId={currentUserId}
            placementMode={
              activePlacement ? { type: activePlacement, label: markerLabel } : null
            }
            onPlace={handlePlace}
            onDeleteMarker={removeMarker}
          />

          {/* Layer control — floating */}
          <div className="absolute top-3 left-3 z-[1000]">
            <LayerControl layers={layers} onToggle={toggleLayer} />
          </div>

          {/* No-squad overlay hint */}
          {!squadLoading && !squad && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[1000]">
              <div className="bg-zinc-900/90 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-400 backdrop-blur">
                Приєднайтесь до загону, щоб ставити мітки
              </div>
            </div>
          )}
        </div>

        {/* Squad sidebar */}
        {showPanel && (
          <aside className="w-64 flex-shrink-0 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden">
            {squadLoading ? (
              <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                Завантаження…
              </div>
            ) : squad ? (
              <SquadPanel
                squad={squad}
                currentUserId={currentUserId}
                onLeave={leaveSquad}
                activePlacement={activePlacement}
                onPlacementToggle={handlePlacementToggle}
                markerLabel={markerLabel}
                onMarkerLabelChange={setMarkerLabel}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4 text-center">
                <div className="text-3xl">⚔</div>
                <div className="text-sm text-zinc-400">
                  Створіть або приєднайтесь до загону, щоб розміщувати спільні мітки в реальному часі
                </div>
                <button
                  onClick={() => setShowSquadModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded transition-colors"
                >
                  Загін
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Squad modal */}
      {showSquadModal && (
        <CreateSquadModal
          onClose={() => setShowSquadModal(false)}
          onCreate={createSquad}
          onJoin={joinSquad}
        />
      )}
    </div>
  )
}
