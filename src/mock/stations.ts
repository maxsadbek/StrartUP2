import { generateAllMockStations } from './generateStations'
import { buildStation } from './stationFactory'
import type { FuelStation } from '@/types/station'

const b = buildStation

/** Qo‘lda kiritilgan premium stansiyalar */
const manualStations: FuelStation[] = [
  b({
    id: 'tk-hero',
    name: 'FuelGo National',
    brand: 'FuelGo',
    city: 'Toshkent',
    address: 'Markaziy shoh ko‘chasi',
    lat: 41.3111,
    lng: 69.2797,
    prices: [
      ['ai92', 'AI-92', 10200],
      ['ai95', 'AI-95', 11400],
      ['metan', 'Metan', 3180],
      ['propan', 'Propan', 4700],
      ['diesel', 'Dizel', 9800],
    ],
    isPremium: true,
    is24h: true,
  }),
]

export const mockStations: FuelStation[] = manualStations

export const STATION_CITIES = [
  ...new Set([
    ...generateAllMockStations().map((s) => s.city),
    ...manualStations.map((s) => s.city),
  ]),
].sort((a, b) => a.localeCompare(b, 'uz'))
