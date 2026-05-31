'use client'

import { Marker } from 'react-leaflet'
import L from 'leaflet'
import type { StaticMarker } from '@/types'
import { StaticMarkerPopup } from './MarkerPopup'

const ICONS: Record<string, string> = {
  exit: '🚪',
  spawn: '🔵',
  boss: '💀',
  loot: '💰',
}

function createDivIcon(emoji: string, color: string) {
  return L.divIcon({
    html: `<div style="
      background:${color};
      border:2px solid rgba(255,255,255,0.3);
      border-radius:50%;
      width:28px;height:28px;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;
      box-shadow:0 2px 6px rgba(0,0,0,0.6);
    ">${emoji}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const STATIC_ICONS: Record<string, L.DivIcon> = {
  exit: createDivIcon('🚪', '#166534'),
  spawn: createDivIcon('🔵', '#1e3a5f'),
  boss: createDivIcon('💀', '#7f1d1d'),
  loot: createDivIcon('💰', '#78350f'),
}

interface StaticMarkerLayerProps {
  markers: StaticMarker[]
  type: 'exit' | 'spawn' | 'boss' | 'loot'
}

export function StaticMarkerLayer({ markers, type }: StaticMarkerLayerProps) {
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={STATIC_ICONS[type] ?? STATIC_ICONS.loot}
        >
          <StaticMarkerPopup marker={marker} />
        </Marker>
      ))}
    </>
  )
}
