import { useLocationStore } from '@/store/locationStore'

/** @deprecated Use useLocationStore or useNearestStations */
export function useUserLocation() {
  const position = useLocationStore((s) => s.position)
  const loading = useLocationStore((s) => s.loading)
  const isGps = useLocationStore((s) => s.isGps)
  const recenter = useLocationStore((s) => s.recenter)
  return { position, loading, isGps, recenter }
}

export type { LatLng } from '@/store/locationStore'
