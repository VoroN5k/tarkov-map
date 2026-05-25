import type { StaticMarker } from '@/types'

type MapStaticData = {
  exits: StaticMarker[]
  spawns: StaticMarker[]
  bosses: StaticMarker[]
  loot: StaticMarker[]
}

const cache: Record<string, MapStaticData> = {}

export async function getStaticMarkers(mapId: string): Promise<MapStaticData> {
  if (cache[mapId]) return cache[mapId]

  const load = async (type: string): Promise<StaticMarker[]> => {
    try {
      const mod = await import(`@/data/${mapId}/${type}.json`)
      return mod.default as StaticMarker[]
    } catch {
      return []
    }
  }

  const [exits, spawns, bosses, loot] = await Promise.all([
    load('exits'),
    load('spawns'),
    load('bosses'),
    load('loot'),
  ])

  cache[mapId] = { exits, spawns, bosses, loot }
  return cache[mapId]
}
