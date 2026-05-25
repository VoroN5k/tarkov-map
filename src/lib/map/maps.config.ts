import type { MapConfig } from '@/types'

// Координати [lat, lng] відповідають [y, x] у CRS.Simple
// Діапазон: 0..1000 по кожній осі
export const MAPS: Record<string, MapConfig> = {
  customs: {
    id: 'customs',
    name: 'Customs',
    imageUrl: '/maps/customs/map.jpg',
    bounds: [[0, 0], [1000, 1000]],
    center: [500, 500],
    minZoom: -1,
    maxZoom: 3,
    defaultZoom: 0,
  },
  woods: {
    id: 'woods',
    name: 'Woods',
    imageUrl: '/maps/woods/map.jpg',
    bounds: [[0, 0], [1000, 1000]],
    center: [500, 500],
    minZoom: -1,
    maxZoom: 3,
    defaultZoom: 0,
  },
  interchange: {
    id: 'interchange',
    name: 'Interchange',
    imageUrl: '/maps/interchange/map.jpg',
    bounds: [[0, 0], [1000, 1000]],
    center: [500, 500],
    minZoom: -1,
    maxZoom: 3,
    defaultZoom: 0,
  },
  shoreline: {
    id: 'shoreline',
    name: 'Shoreline',
    imageUrl: '/maps/shoreline/map.jpg',
    bounds: [[0, 0], [1000, 1000]],
    center: [500, 500],
    minZoom: -1,
    maxZoom: 3,
    defaultZoom: 0,
  },
  factory: {
    id: 'factory',
    name: 'Factory',
    imageUrl: '/maps/factory/map.jpg',
    bounds: [[0, 0], [1000, 1000]],
    center: [500, 500],
    minZoom: -1,
    maxZoom: 3,
    defaultZoom: 1,
  },
  reserve: {
    id: 'reserve',
    name: 'Reserve',
    imageUrl: '/maps/reserve/map.jpg',
    bounds: [[0, 0], [1000, 1000]],
    center: [500, 500],
    minZoom: -1,
    maxZoom: 3,
    defaultZoom: 0,
  },
}

export const MAP_LIST = Object.values(MAPS)
