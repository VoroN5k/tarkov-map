'use client'

import { Popup } from 'react-leaflet'
import type { SquadMarker, StaticMarker } from '@/types'

const MARKER_TYPE_LABELS: Record<string, string> = {
  ENEMY: '☠ Ворог',
  LOOT: '💰 Лут',
  MEETING: '📍 Зустріч',
  DANGER: '⚠ Небезпека',
  CUSTOM: '📌 Мітка',
  exit: '🚪 Вихід',
  spawn: '🔵 Спавн',
  boss: '💀 Бос',
  loot: '💰 Лут-зона',
}

interface SquadMarkerPopupProps {
  marker: SquadMarker
  canDelete: boolean
  onDelete: (id: string) => void
}

export function SquadMarkerPopup({ marker, canDelete, onDelete }: SquadMarkerPopupProps) {
  const expiresAt = new Date(marker.expiresAt)
  const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000))

  return (
    <Popup>
      <div className="min-w-[160px] text-sm">
        <div className="font-semibold mb-1">{MARKER_TYPE_LABELS[marker.type] ?? marker.type}</div>
        {marker.label && <div className="text-zinc-600 mb-1">{marker.label}</div>}
        <div className="text-xs text-zinc-400">
          від {marker.createdBy?.username ?? '—'}
        </div>
        <div className="text-xs text-zinc-400">зникне через {minutesLeft} хв</div>
        {canDelete && (
          <button
            onClick={() => onDelete(marker.id)}
            className="mt-2 w-full px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Видалити
          </button>
        )}
      </div>
    </Popup>
  )
}

interface StaticMarkerPopupProps {
  marker: StaticMarker
}

export function StaticMarkerPopup({ marker }: StaticMarkerPopupProps) {
  return (
    <Popup>
      <div className="min-w-[140px] text-sm">
        <div className="font-semibold mb-1">{MARKER_TYPE_LABELS[marker.type] ?? marker.type}</div>
        <div>{marker.label}</div>
        {marker.description && (
          <div className="text-xs text-zinc-500 mt-1">{marker.description}</div>
        )}
      </div>
    </Popup>
  )
}
