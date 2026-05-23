import { create } from 'zustand'
import type { StationFilters } from '@/types/station'

const defaultFilters: StationFilters = {
  fuelTypes: [],
  maxDistance: 10,
  minRating: 0,
  openNow: false,
  sortBy: 'distance',
  search: '',
}

interface FiltersState extends StationFilters {
  setSearch: (search: string) => void
  setSortBy: (sortBy: StationFilters['sortBy']) => void
  toggleFuelType: (type: StationFilters['fuelTypes'][number]) => void
  setMaxDistance: (km: number) => void
  setMinRating: (rating: number) => void
  setOpenNow: (open: boolean) => void
  reset: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...defaultFilters,
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleFuelType: (type) =>
    set((s) => ({
      fuelTypes: s.fuelTypes.includes(type)
        ? s.fuelTypes.filter((t) => t !== type)
        : [...s.fuelTypes, type],
    })),
  setMaxDistance: (maxDistance) => set({ maxDistance }),
  setMinRating: (minRating) => set({ minRating }),
  setOpenNow: (openNow) => set({ openNow }),
  reset: () => set(defaultFilters),
}))
