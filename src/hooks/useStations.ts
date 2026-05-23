import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/services/api/queryKeys'
import { stationsService } from '@/services/stations.service'
import { useFiltersStore } from '@/store/filtersStore'

export function useStations() {
  const filters = useFiltersStore()
  return useQuery({
    queryKey: queryKeys.stations.list({
      search: filters.search,
      sortBy: filters.sortBy,
      openNow: filters.openNow,
      fuelTypes: filters.fuelTypes,
      maxDistance: filters.maxDistance,
      minRating: filters.minRating,
    }),
    queryFn: () =>
      stationsService.getAll({
        search: filters.search,
        sortBy: filters.sortBy,
        openNow: filters.openNow,
        fuelTypes: filters.fuelTypes,
        maxDistance: filters.maxDistance,
        minRating: filters.minRating,
      }),
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
