'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MAP_LIST } from '@/lib/map/maps.config'

export function MapSelector() {
  const params = useParams()
  const currentMapId = params?.mapId as string

  return (
    <div className="flex gap-1 flex-wrap">
      {MAP_LIST.map((map) => (
        <Link
          key={map.id}
          href={`/map/${map.id}`}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            currentMapId === map.id
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          {map.name}
        </Link>
      ))}
    </div>
  )
}
