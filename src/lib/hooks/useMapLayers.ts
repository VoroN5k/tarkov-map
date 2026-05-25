'use client'

import { useState, useCallback } from 'react'
import type { MapLayer, LayerId } from '@/types'

const DEFAULT_LAYERS: MapLayer[] = [
  { id: 'exits', label: 'Виходи', enabled: true, color: '#22c55e' },
  { id: 'spawns', label: 'Спавни', enabled: false, color: '#3b82f6' },
  { id: 'bosses', label: 'Боси', enabled: true, color: '#ef4444' },
  { id: 'loot', label: 'Лут', enabled: false, color: '#eab308' },
  { id: 'squad', label: 'Загін', enabled: true, color: '#a855f7' },
]

export function useMapLayers() {
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS)

  const toggleLayer = useCallback((id: LayerId) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
    )
  }, [])

  const isEnabled = useCallback(
    (id: LayerId) => layers.find((l) => l.id === id)?.enabled ?? false,
    [layers]
  )

  return { layers, toggleLayer, isEnabled }
}
