import { mockStations } from '@/mock/stations'
import { generateAllMockStations } from '@/mock/generateStations'
import { fetchOsmFuelStations } from './osm-stations.service'
import { env } from '@/constants/env'
import { getDistanceKm } from '@/utils/geo'
import type { FuelStation } from '@/types/station'

let memoryCache: FuelStation[] | null = null
let loadPromise: Promise<FuelStation[]> | null = null

function dedupeStations(stations: FuelStation[], minKm = 0.08): FuelStation[] {
  const result: FuelStation[] = []
  for (const s of stations) {
    const tooClose = result.some(
      (r) => getDistanceKm(r.lat, r.lng, s.lat, s.lng) < minKm,
    )
    if (!tooClose) result.push(s)
  }
  return result
}

/** OSM (haqiqiy) + mock + generatsiya — to‘liq bazа */
export async function loadAllStations(): Promise<FuelStation[]> {
  if (memoryCache) return memoryCache
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const generated = generateAllMockStations()
    const manual = mockStations
    let osm: FuelStation[] = []

    if (env.useOsmStations) {
      try {
        osm = await fetchOsmFuelStations()
      } catch (e) {
        console.warn('[FuelGo] OSM yuklanmadi, mock ishlatiladi:', e)
      }
    }

    const merged = dedupeStations([...osm, ...manual, ...generated], 0.05)
    memoryCache = merged
    console.info(`[FuelGo] Jami ${merged.length} ta zapravka yuklandi (OSM: ${osm.length})`)
    return merged
  })()

  return loadPromise
}

export function clearStationsCache() {
  memoryCache = null
  loadPromise = null
  sessionStorage.removeItem('fuelgo-osm-stations-v1')
}
