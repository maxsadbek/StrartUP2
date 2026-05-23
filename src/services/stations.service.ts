import { loadAllStations } from './stations.repository'
import { mockReviews } from '@/mock/reviews'
import type { FuelStation, StationFilters } from '@/types/station'
import type { StationReview } from '@/types/station'

function applyFilters(stations: FuelStation[], filters?: Partial<StationFilters>) {
  if (!filters) return stations
  let result = [...stations]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    )
  }
  if (filters.openNow) result = result.filter((s) => s.isOpen)
  if (filters.minRating) result = result.filter((s) => s.rating >= filters.minRating!)
  if (filters.fuelTypes?.length) {
    result = result.filter((s) =>
      filters.fuelTypes!.some((t) => s.prices.some((p) => p.type === t && p.available)),
    )
  }

  return result
}

export const stationsService = {
  async getAll(filters?: Partial<StationFilters>): Promise<FuelStation[]> {
    const all = await loadAllStations()
    return applyFilters(all, filters)
  },

  async getById(id: string): Promise<FuelStation | null> {
    const all = await loadAllStations()
    return all.find((s) => s.id === id) ?? null
  },

  async getReviews(stationId: string): Promise<StationReview[]> {
    await loadAllStations()
    return mockReviews[stationId] ?? [
      {
        id: 'r-default',
        author: 'Haydovchi',
        rating: 5,
        comment: 'Yaxshi xizmat, navbat qisqa.',
        createdAt: new Date().toISOString(),
      },
    ]
  },

  async search(query: string): Promise<FuelStation[]> {
    return this.getAll({ search: query })
  },

  async getTotalCount(): Promise<number> {
    const all = await loadAllStations()
    return all.length
  },
}
