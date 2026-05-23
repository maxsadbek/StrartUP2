import { create } from 'zustand'

interface MapState {
  selectedStationId: string | null
  selectStation: (id: string | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedStationId: null,
  selectStation: (id) => set({ selectedStationId: id }),
}))
