import { create } from 'zustand'
import { UZBEKISTAN_CENTER } from '@/utils/geo'

export interface LatLng {
  lat: number
  lng: number
}

interface LocationState {
  position: LatLng
  loading: boolean
  isGps: boolean
  initialized: boolean
  error: string | null
  initLocation: () => void
  recenter: () => void
}

function requestPosition(
  onSuccess: (pos: LatLng) => void,
  onError: () => void,
) {
  if (!navigator.geolocation) {
    onError()
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      onSuccess({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    onError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 30_000 },
  )
}

export const useLocationStore = create<LocationState>((set, get) => ({
  position: UZBEKISTAN_CENTER,
  loading: true,
  isGps: false,
  initialized: false,
  error: null,

  initLocation: () => {
    if (get().initialized) return
    set({ initialized: true, loading: true })

    requestPosition(
      (position) => set({ position, isGps: true, loading: false, error: null }),
      () => set({ loading: false, error: 'Joylashuv aniqlanmadi — O‘zbekiston markazi ishlatilmoqda' }),
    )

    // Yangilanishlar uchun kuzatuv
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) =>
          set({
            position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            isGps: true,
            loading: false,
          }),
        undefined,
        { enableHighAccuracy: true, maximumAge: 60_000 },
      )
    }
  },

  recenter: () => {
    set({ loading: true })
    requestPosition(
      (position) => set({ position, isGps: true, loading: false, error: null }),
      () => set({ loading: false, error: 'GPS ishlamadi' }),
    )
  },
}))
