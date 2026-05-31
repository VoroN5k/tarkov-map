'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer as LeafletMapContainer, ImageOverlay, ZoomControl, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import type { MapConfig, MarkerType, StaticMarker, SquadMarker } from '@/types'
import type { MapLayer } from '@/types'
import { StaticMarkerLayer } from './StaticMarkerLayer'
import { SquadMarkerLayer } from './SquadMarkerLayer'

interface PlacementMode {
  type: MarkerType
  label: string
}

interface MapContainerProps {
  config: MapConfig
  layers: MapLayer[]
  staticMarkers: {
    exits: StaticMarker[]
    spawns: StaticMarker[]
    bosses: StaticMarker[]
    loot: StaticMarker[]
  }
  squadMarkers: SquadMarker[]
  currentUserId: string
  placementMode: PlacementMode | null
  onPlace: (lat: number, lng: number) => void
  onDeleteMarker: (id: string) => void
}

function CoordDisplay() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)
  useMapEvents({
    mousemove(e) { setPos({ lat: Math.round(e.latlng.lat), lng: Math.round(e.latlng.lng) }) },
    mouseout() { setPos(null) },
  })
  if (!pos) return null
  return (
    <div
      style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 1000, pointerEvents: 'none' }}
      className="bg-zinc-900/80 text-zinc-300 text-xs px-2 py-1 rounded font-mono border border-zinc-700"
    >
      lat {pos.lat} lng {pos.lng}
    </div>
  )
}

const MARKER_TYPES: { type: MarkerType; label: string; icon: string }[] = [
  { type: 'ENEMY', label: 'Ворог', icon: '☠' },
  { type: 'DANGER', label: 'Небезпека', icon: '⚠' },
  { type: 'MEETING', label: 'Зустріч', icon: '📍' },
  { type: 'LOOT', label: 'Лут', icon: '💰' },
  { type: 'CUSTOM', label: 'Мітка', icon: '📌' },
]

const MARKER_COLORS: Record<MarkerType, string> = {
  ENEMY: '#dc2626',
  DANGER: '#ea580c',
  MEETING: '#7c3aed',
  LOOT: '#ca8a04',
  CUSTOM: '#0891b2',
}

export function TarkovMap({
  config,
  layers,
  staticMarkers,
  squadMarkers,
  currentUserId,
  placementMode,
  onPlace,
  onDeleteMarker,
}: MapContainerProps) {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([])
  const [drawingRoute, setDrawingRoute] = useState(false)

  const isEnabled = (id: string) => layers.find((l) => l.id === id)?.enabled ?? false

  const bounds = config.bounds as [[number, number], [number, number]]

  return (
    <div className="relative w-full h-full">
      <LeafletMapContainer
        center={config.center}
        zoom={config.defaultZoom}
        minZoom={config.minZoom}
        maxZoom={config.maxZoom}
        crs={L.CRS.Simple}
        maxBounds={[
          [bounds[0][0] - 50, bounds[0][1] - 50],
          [bounds[1][0] + 50, bounds[1][1] + 50],
        ]}
        maxBoundsViscosity={0.9}
        zoomControl={false}
        style={{ width: '100%', height: '100%', background: '#1a1a1a' }}
        className={placementMode || drawingRoute ? 'cursor-crosshair' : ''}
      >
        <ZoomControl position="bottomright" />
        <CoordDisplay />

        <ImageOverlay
          url={config.imageUrl}
          bounds={bounds}
          opacity={0.95}
        />

        {isEnabled('exits') && <StaticMarkerLayer markers={staticMarkers.exits} type="exit" />}
        {isEnabled('spawns') && <StaticMarkerLayer markers={staticMarkers.spawns} type="spawn" />}
        {isEnabled('bosses') && <StaticMarkerLayer markers={staticMarkers.bosses} type="boss" />}
        {isEnabled('loot') && <StaticMarkerLayer markers={staticMarkers.loot} type="loot" />}

        {isEnabled('squad') && (
          <SquadMarkerLayer
            markers={squadMarkers}
            currentUserId={currentUserId}
            placementMode={placementMode}
            onPlace={onPlace}
            onDelete={onDeleteMarker}
            routePoints={routePoints}
            onRoutePoint={(lat, lng) => setRoutePoints((p) => [...p, [lat, lng]])}
            drawingRoute={drawingRoute}
          />
        )}
      </LeafletMapContainer>

      {/* Route drawing toolbar */}
      <div className="absolute bottom-14 right-3 z-[1000] flex flex-col gap-1">
        <button
          onClick={() => {
            setDrawingRoute((v) => !v)
            if (drawingRoute) setRoutePoints([])
          }}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shadow ${
            drawingRoute
              ? 'bg-amber-500 text-black'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600'
          }`}
        >
          {drawingRoute ? '⏹ Стоп маршрут' : '✏ Маршрут'}
        </button>
        {routePoints.length > 0 && !drawingRoute && (
          <button
            onClick={() => setRoutePoints([])}
            className="px-3 py-1.5 rounded text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-600"
          >
            🗑 Очистити
          </button>
        )}
      </div>
    </div>
  )
}
