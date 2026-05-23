import { UZBEKISTAN_BOUNDS, UZBEKISTAN_CENTER, UZBEKISTAN_CITIES } from '@/constants/uzbekistan'

/** Haversine distance in km */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function sortByDistance<T extends { lat: number; lng: number }>(
  items: T[],
  userLat: number,
  userLng: number,
): (T & { distanceKm: number })[] {
  return items
    .map((item) => ({
      ...item,
      distanceKm: getDistanceKm(userLat, userLng, item.lat, item.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

export function isInsideUzbekistan(lat: number, lng: number): boolean {
  return (
    lat >= UZBEKISTAN_BOUNDS.south &&
    lat <= UZBEKISTAN_BOUNDS.north &&
    lng >= UZBEKISTAN_BOUNDS.west &&
    lng <= UZBEKISTAN_BOUNDS.east
  )
}

/** GPS yo‘q bo‘lganda default nuqta */
export const TASHKENT_CENTER = UZBEKISTAN_CENTER

export { UZBEKISTAN_CENTER, UZBEKISTAN_BOUNDS }

export function getNearestCityName(lat: number, lng: number): string {
  const cities = UZBEKISTAN_CITIES.filter((c) => c.id !== 'all')
  let nearest = cities[0]
  let min = Infinity
  for (const city of cities) {
    const d = getDistanceKm(lat, lng, city.lat, city.lng)
    if (d < min) {
      min = d
      nearest = city
    }
  }
  return nearest.name
}

export function normalizeCityKey(city: string): string {
  return city
    .toLowerCase()
    .replace(/['`]/g, '')
    .replace(/\s+/g, '')
    .replace('fargona', 'fargona')
    .replace('samarqand', 'samarqand')
    .replace('toshkent', 'toshkent')
}
