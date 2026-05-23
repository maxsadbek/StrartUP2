export interface RouteResult {
  distanceMeters: number
  durationSeconds: number
  /** [lat, lng][] for Leaflet */
  coordinates: [number, number][]
}

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

export async function fetchDrivingRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<RouteResult> {
  const url = `${OSRM_BASE}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Route not found')

  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes?.[0]) {
    throw new Error('No route available')
  }

  const route = data.routes[0]
  const coordinates: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng],
  )

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    coordinates,
  }
}

/** Fallback when OSRM is unavailable */
export function estimateStraightRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): RouteResult {
  const km =
    Math.sqrt((to.lat - from.lat) ** 2 + (to.lng - from.lng) ** 2) * 111
  const distanceMeters = km * 1000 * 1.35
  const durationSeconds = (distanceMeters / 1000 / 35) * 3600
  return {
    distanceMeters,
    durationSeconds,
    coordinates: [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
  }
}
