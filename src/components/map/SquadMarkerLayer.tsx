'use client'

import { Marker, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useState } from 'react'
import type { SquadMarker, MarkerType } from '@/types'
import { SquadMarkerPopup } from './MarkerPopup'

const MARKER_CONFIG: Record<MarkerType, { emoji: string; bg: string }> = {
  ENEMY: { emoji: '☠', bg: '#dc2626' },
  LOOT: { emoji: '💰', bg: '#ca8a04' },
  MEETING: { emoji: '📍', bg: '#7c3aed' },
  DANGER: { emoji: '⚠', bg: '#ea580c' },
  CUSTOM: { emoji: '📌', bg: '#0891b2' },
}

function createSquadIcon(type: MarkerType) {
  const { emoji, bg } = MARKER_CONFIG[type]
  return L.divIcon({
    html: `<div style="
      background:${bg};
      border:2px solid rgba(255,255,255,0.5);
      border-radius:50%;
      width:32px;height:32px;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;
      box-shadow:0 0 0 2px ${bg}44,0 3px 8px rgba(0,0,0,0.7);
      animation: pulse-ring 2s ease-out infinite;
    ">${emoji}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

const SQUAD_ICONS = Object.fromEntries(
  (Object.keys(MARKER_CONFIG) as MarkerType[]).map((t) => [t, createSquadIcon(t)])
) as Record<MarkerType, L.DivIcon>

interface PlacementMode {
  type: MarkerType
  label: string
}

interface SquadMarkerLayerProps {
  markers: SquadMarker[]
  currentUserId: string
  placementMode: PlacementMode | null
  onPlace: (lat: number, lng: number) => void
  onDelete: (id: string) => void
  routePoints: [number, number][]
  onRoutePoint: (lat: number, lng: number) => void
  drawingRoute: boolean
}

function MapClickHandler({
  placementMode,
  onPlace,
  drawingRoute,
  onRoutePoint,
}: {
  placementMode: PlacementMode | null
  onPlace: (lat: number, lng: number) => void
  drawingRoute: boolean
  onRoutePoint: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      if (drawingRoute) {
        onRoutePoint(e.latlng.lat, e.latlng.lng)
      } else if (placementMode) {
        onPlace(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export function SquadMarkerLayer({
  markers,
  currentUserId,
  placementMode,
  onPlace,
  onDelete,
  routePoints,
  onRoutePoint,
  drawingRoute,
}: SquadMarkerLayerProps) {
  return (
    <>
      <MapClickHandler
        placementMode={placementMode}
        onPlace={onPlace}
        drawingRoute={drawingRoute}
        onRoutePoint={onRoutePoint}
      />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={SQUAD_ICONS[marker.type]}
        >
          <SquadMarkerPopup
            marker={marker}
            canDelete={marker.createdById === currentUserId}
            onDelete={onDelete}
          />
        </Marker>
      ))}

      {routePoints.length >= 2 && (
        <Polyline
          positions={routePoints}
          color="#f59e0b"
          weight={3}
          opacity={0.8}
          dashArray="8, 4"
        />
      )}

      {routePoints.map((point, i) => (
        <Marker
          key={`route-${i}`}
          position={point}
          icon={L.divIcon({
            html: `<div style="
              background:#f59e0b;border:2px solid white;border-radius:50%;
              width:14px;height:14px;box-shadow:0 2px 4px rgba(0,0,0,0.5)
            "></div>`,
            className: '',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          })}
        />
      ))}
    </>
  )
}
