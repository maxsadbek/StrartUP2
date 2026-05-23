import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/services/api/queryKeys'
import { stationsService } from '@/services/stations.service'
import { useFiltersStore } from '@/store/filtersStore'

export function useStations() {
  const filters = useFiltersStore()
  return useQuery({
    queryKey: queryKeys.stations.list({
      v: 'full-uz',
      search: filters.search,
      openNow: filters.openNow,
      fuelTypes: filters.fuelTypes,
      minRating: filters.minRating,
    }),
    queryFn: () =>
      stationsService.getAll({
        search: filters.search,
        openNow: filters.openNow,
        fuelTypes: filters.fuelTypes,
        minRating: filters.minRating,
      }),
    staleTime: 60 * 60_000,
    gcTime: 2 * 60 * 60_000,
  })
}

export function useStation(id: string) {
  return useQuery({
    queryKey: queryKeys.stations.detail(id),
    queryFn: () => stationsService.getById(id),
    enabled: !!id,
  })
}

export function useStationReviews(id: string) {
  return useQuery({
    queryKey: queryKeys.stations.reviews(id),
    queryFn: () => stationsService.getReviews(id),
    enabled: !!id,
  })
}
