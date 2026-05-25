export type MarkerType = 'ENEMY' | 'LOOT' | 'MEETING' | 'DANGER' | 'CUSTOM'
export type MemberRole = 'OWNER' | 'MEMBER'

export interface MapConfig {
  id: string
  name: string
  imageUrl: string
  bounds: [[number, number], [number, number]]
  center: [number, number]
  minZoom: number
  maxZoom: number
  defaultZoom: number
}

export interface StaticMarker {
  id: string
  type: 'exit' | 'spawn' | 'boss' | 'loot'
  label: string
  lat: number
  lng: number
  description?: string
}

export interface SquadMarker {
  id: string
  type: MarkerType
  label: string | null
  lat: number
  lng: number
  createdAt: string
  expiresAt: string
  squadId: string
  mapId: string
  createdById: string
  createdBy?: { username: string }
}

export interface SquadMember {
  id: string
  role: MemberRole
  userId: string
  user: { username: string; avatarUrl: string | null }
}

export interface Squad {
  id: string
  name: string
  inviteCode: string
  createdAt: string
  ownerId: string
  members: SquadMember[]
}

export type LayerId = 'exits' | 'spawns' | 'bosses' | 'loot' | 'squad'

export interface MapLayer {
  id: LayerId
  label: string
  enabled: boolean
  color: string
}
