'use client'

import { useState } from 'react'
import type { Squad, MarkerType } from '@/types'
import { InviteCode } from './InviteCode'
import { MemberList } from './MemberList'
import { Button } from '@/components/ui/button'

const MARKER_TYPES: { type: MarkerType; label: string; icon: string; color: string }[] = [
  { type: 'ENEMY', label: 'Ворог', icon: '☠', color: '#dc2626' },
  { type: 'DANGER', label: 'Небезпека', icon: '⚠', color: '#ea580c' },
  { type: 'MEETING', label: 'Зустріч', icon: '📍', color: '#7c3aed' },
  { type: 'LOOT', label: 'Лут', icon: '💰', color: '#ca8a04' },
  { type: 'CUSTOM', label: 'Мітка', icon: '📌', color: '#0891b2' },
]

interface SquadPanelProps {
  squad: Squad
  currentUserId: string
  onLeave: () => void
  activePlacement: MarkerType | null
  onPlacementToggle: (type: MarkerType) => void
  markerLabel: string
  onMarkerLabelChange: (v: string) => void
}

export function SquadPanel({
  squad,
  currentUserId,
  onLeave,
  activePlacement,
  onPlacementToggle,
  markerLabel,
  onMarkerLabelChange,
}: SquadPanelProps) {
  const [showMembers, setShowMembers] = useState(true)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Squad header */}
      <div className="p-3 border-b border-zinc-800">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold text-zinc-100 text-sm">{squad.name}</h2>
            <div className="text-xs text-zinc-500 mt-0.5">
              {squad.members.length} учасник{squad.members.length !== 1 ? 'ів' : ''}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLeave} className="text-xs text-zinc-500 hover:text-red-400 flex-shrink-0">
            Вийти
          </Button>
        </div>
      </div>

      {/* Invite code */}
      <div className="p-3 border-b border-zinc-800">
        <InviteCode code={squad.inviteCode} />
      </div>

      {/* Marker placement */}
      <div className="p-3 border-b border-zinc-800">
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Поставити мітку</div>

        <div className="mb-2">
          <input
            type="text"
            placeholder="Опис (необов'язково)"
            value={markerLabel}
            onChange={(e) => onMarkerLabelChange(e.target.value)}
            maxLength={64}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-5 gap-1">
          {MARKER_TYPES.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => onPlacementToggle(type)}
              title={label}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all text-xs ${
                activePlacement === type
                  ? 'ring-2 scale-110'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
              style={activePlacement === type ? { outline: `2px solid ${color}`, backgroundColor: color + '33' } : {}}
            >
              <span className="text-base">{icon}</span>
              <span className="text-zinc-400 text-[10px]">{label}</span>
            </button>
          ))}
        </div>

        {activePlacement && (
          <div className="mt-2 text-xs text-amber-400 text-center animate-pulse">
            Клацніть на карту для розміщення
          </div>
        )}
      </div>

      {/* Members */}
      <div className="p-3 flex-1">
        <button
          onClick={() => setShowMembers((v) => !v)}
          className="flex items-center justify-between w-full text-xs text-zinc-500 uppercase tracking-wider mb-2"
        >
          <span>Учасники ({squad.members.length})</span>
          <span>{showMembers ? '▲' : '▼'}</span>
        </button>
        {showMembers && (
          <MemberList
            members={squad.members}
            currentUserId={currentUserId}
            ownerId={squad.ownerId}
          />
        )}
      </div>
    </div>
  )
}
