import { mockStations } from '@/mock/stations'
import { mockReviews } from '@/mock/reviews'
import type { FuelStation, StationFilters } from '@/types/station'
import type { StationReview } from '@/types/station'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

function applyFilters(stations: FuelStation[], filters?: Partial<StationFilters>) {
  if (!filters) return stations
  let result = [...stations]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q),
    )
  }
  if (filters.openNow) result = result.filter((s) => s.isOpen)
  if (filters.minRating) result = result.filter((s) => s.rating >= filters.minRating!)
  if (filters.maxDistance) result = result.filter((s) => s.distance <= filters.maxDistance!)
  if (filters.fuelTypes?.length) {
    result = result.filter((s) =>
      filters.fuelTypes!.some((t) => s.prices.some((p) => p.type === t && p.available)),
    )
  }

  switch (filters.sortBy) {
    case 'price':
      result.sort((a, b) => getMinPrice(a) - getMinPrice(b))
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'queue':
      result.sort((a, b) => a.queueMinutes - b.queueMinutes)
      break
    default:
      result.sort((a, b) => a.distance - b.distance)
  }

  return result
}

function getMinPrice(station: FuelStation) {
  return Math.min(...station.prices.filter((p) => p.available).map((p) => p.price))
}

export const stationsService = {
  async getAll(filters?: Partial<StationFilters>): Promise<FuelStation[]> {
    await delay()
    return applyFilters(mockStations, filters)
  },

  async getById(id: string): Promise<FuelStation | null> {
    await delay(300)
    return mockStations.find((s) => s.id === id) ?? null
  },

  async getReviews(stationId: string): Promise<StationReview[]> {
    await delay(250)
    return mockReviews[stationId] ?? []
  },

  async search(query: string): Promise<FuelStation[]> {
    return this.getAll({ search: query })
  },
}
