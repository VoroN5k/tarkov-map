'use client'

import type { MapLayer, LayerId } from '@/types'

interface LayerControlProps {
  layers: MapLayer[]
  onToggle: (id: LayerId) => void
}

export function LayerControl({ layers, onToggle }: LayerControlProps) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 backdrop-blur">
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
        Шари
      </div>
      <div className="flex flex-col gap-1.5">
        {layers.map((layer) => (
          <label key={layer.id} className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className="relative w-8 h-4 rounded-full transition-colors"
              style={{ backgroundColor: layer.enabled ? layer.color : '#52525b' }}
              onClick={() => onToggle(layer.id)}
            >
              <div
                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                  layer.enabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-sm text-zinc-300">{layer.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
