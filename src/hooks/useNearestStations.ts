import { useMemo } from 'react'
import { useStations } from '@/hooks/useStations'
import { useLocationStore } from '@/store/locationStore'
import { useFiltersStore } from '@/store/filtersStore'
import { sortByDistance, isInsideUzbekistan, getNearestCityName } from '@/utils/geo'
import type { FuelStation, FuelType } from '@/types/station'

export type StationWithDistance = FuelStation & { distanceKm: number }

function applyListFilters(
  list: StationWithDistance[],
  opts: {
    maxDistance: number
    fuelTypes: FuelType[]
    openNow: boolean
    minRating: number
    search: string
    city: string
    skipDistance?: boolean
  },
) {
  let result = list

  if (opts.city && opts.city !== 'all') {
    result = result.filter((s) => s.city === opts.city)
  }
  if (!opts.skipDistance && opts.maxDistance > 0) {
    result = result.filter((s) => s.distanceKm <= opts.maxDistance)
  }
  if (opts.openNow) {
    result = result.filter((s) => s.isOpen)
  }
  if (opts.minRating > 0) {
    result = result.filter((s) => s.rating >= opts.minRating)
  }
  if (opts.fuelTypes.length > 0) {
    result = result.filter((s) =>
      opts.fuelTypes.some((t) =>
        s.prices.some((p) => p.type === t && p.available),
      ),
    )
  }
  if (opts.search.trim()) {
    const q = opts.search.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.prices.some((p) => p.label.toLowerCase().includes(q)),
    )
  }

  return result
}

export function useNearestStations(limit?: number) {
  const { data: stations = [], isLoading, isError, refetch } = useStations()
  const position = useLocationStore((s) => s.position)
  const gpsLoading = useLocationStore((s) => s.loading)
  const isGps = useLocationStore((s) => s.isGps)
  const locationError = useLocationStore((s) => s.error)
  const { maxDistance, fuelTypes, openNow, minRating, search, city } = useFiltersStore()

  const isOutsideUzbekistan = useMemo(
    () => !isInsideUzbekistan(position.lat, position.lng),
    [position.lat, position.lng],
  )

  const nearestCityName = useMemo(
    () => (isGps ? getNearestCityName(position.lat, position.lng) : null),
    [isGps, position.lat, position.lng],
  )

  const allWithDistance = useMemo(() => {
    const sorted = sortByDistance(stations, position.lat, position.lng)
    return sorted.map((s) => ({
      ...s,
      distance: s.distanceKm,
    })) as StationWithDistance[]
  }, [stations, position.lat, position.lng])

  const mapStations = useMemo(
    () =>
      applyListFilters(allWithDistance, {
        maxDistance: 0,
        fuelTypes,
        openNow,
        minRating,
        search,
        city,
        skipDistance: true,
      }),
    [allWithDistance, fuelTypes, openNow, minRating, search, city],
  )

  const { sorted, usingFallback } = useMemo(() => {
    const filterOpts = { maxDistance, fuelTypes, openNow, minRating, search, city }

    let list = applyListFilters(allWithDistance, filterOpts)

    if (list.length === 0 && allWithDistance.length > 0) {
      list = applyListFilters(allWithDistance, {
        ...filterOpts,
        maxDistance: 0,
        skipDistance: true,
      })
      return { sorted: list, usingFallback: true }
    }

    return { sorted: list, usingFallback: false }
  }, [allWithDistance, maxDistance, fuelTypes, openNow, minRating, search, city])

  const nearest = useMemo(
    () => (limit ? sorted.slice(0, limit) : sorted),
    [sorted, limit],
  )

  const nearestIds = useMemo(
    () => new Set(sorted.slice(0, 3).map((s) => s.id)),
    [sorted],
  )

  return {
    nearest,
    allSorted: sorted,
    mapStations,
    totalCount: mapStations.length,
    listCount: sorted.length,
    nearestIds,
    isOutsideUzbekistan,
    nearestCityName,
    usingFallback,
    isLoading: isLoading || gpsLoading,
    isGps,
    position,
    locationError,
    isError,
    refetch,
  }
}
