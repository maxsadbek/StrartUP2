import { useQuery } from '@tanstack/react-query'
import {
  fetchDrivingRoute,
  estimateStraightRoute,
  type RouteResult,
} from '@/services/routing.service'
import type { LatLng } from '@/store/locationStore'

export function useRoute(from: LatLng | null, to: LatLng | null, enabled = true) {
  return useQuery({
    queryKey: ['route', from?.lat, from?.lng, to?.lat, to?.lng],
    queryFn: async (): Promise<RouteResult> => {
      if (!from || !to) throw new Error('Missing coordinates')
      try {
        return await fetchDrivingRoute(from, to)
      } catch {
        return estimateStraightRoute(from, to)
      }
    },
    enabled: enabled && !!from && !!to,
    staleTime: 5 * 60_000,
  })
}
