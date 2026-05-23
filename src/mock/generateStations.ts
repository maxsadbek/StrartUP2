import { UZBEKISTAN_CITIES } from '@/constants/uzbekistan'
import { buildStation } from './stationFactory'
import type { FuelStation, FuelType } from '@/types/station'

type PriceInput = [FuelType, string, number]

const FUEL_SETS: PriceInput[][] = [
  [['ai92', 'AI-92', 10100], ['ai95', 'AI-95', 11300], ['diesel', 'Dizel', 9700]],
  [['metan', 'Metan', 3150]],
  [['propan', 'Propan', 4700]],
  [['ai92', 'AI-92', 10200], ['metan', 'Metan', 3180], ['propan', 'Propan', 4750]],
  [['ai95', 'AI-95', 11400], ['diesel', 'Dizel', 9850]],
  [['ai92', 'AI-92', 10080], ['ai95', 'AI-95', 11280], ['ai98', 'AI-98', 12700], ['diesel', 'Dizel', 9600]],
]

const BRANDS = ['UZNeft', 'Neft', 'MetanGaz', 'PropanGaz', 'FuelGo', 'SilkOil', 'EcoFuel', 'AvtoGaz']

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/** Har bir shahar atrofida ko‘p zapravka */
function generateForCity(cityName: string, baseLat: number, baseLng: number, count: number): FuelStation[] {
  const stations: FuelStation[] = []
  for (let i = 0; i < count; i++) {
    const seed = cityName.charCodeAt(0) * 1000 + i
    const angle = seededRandom(seed) * Math.PI * 2
    const radius = 0.02 + seededRandom(seed + 1) * 0.12
    const lat = baseLat + Math.cos(angle) * radius
    const lng = baseLng + Math.sin(angle) * radius * 1.35
    const fuelSet = FUEL_SETS[i % FUEL_SETS.length]
    const brand = BRANDS[i % BRANDS.length]
    const isMetan = fuelSet.some((f) => f[0] === 'metan') && fuelSet.length === 1
    const isPropan = fuelSet.some((f) => f[0] === 'propan') && fuelSet.length === 1

    stations.push(
      buildStation({
        id: `gen-${cityName.replace(/\s/g, '')}-${i}`,
        name: isMetan
          ? `${cityName} Metan ${i + 1}`
          : isPropan
            ? `${cityName} Propan ${i + 1}`
            : `${brand} ${cityName} ${i + 1}`,
        brand,
        city: cityName,
        address: `${cityName}, ${i + 1}-mavze`,
        lat,
        lng,
        prices: fuelSet.map(([type, label, price]) => [
          type,
          label,
          price + Math.floor(seededRandom(seed + 2) * 400) - 200,
        ]) as PriceInput[],
        is24h: i % 5 === 0,
        queueMinutes: Math.floor(seededRandom(seed + 3) * 15),
      }),
    )
  }
  return stations
}

/** Mamlakat bo‘ylab qo‘shimcha nuqtalar (yo‘l bo‘ylab) */
function generateHighwayStations(): FuelStation[] {
  const corridors: Array<[number, number, string]> = [
    [41.3, 69.2, 'Toshkent'],
    [39.65, 66.95, 'Samarqand'],
    [39.77, 64.42, 'Buxoro'],
    [40.78, 72.34, 'Andijon'],
    [37.22, 67.27, 'Termiz'],
    [42.46, 59.6, 'Nukus'],
    [41.55, 60.63, 'Urganch'],
    [40.1, 67.84, 'Jizzax'],
    [38.86, 65.79, 'Qarshi'],
    [40.99, 71.67, 'Namangan'],
    [40.38, 71.78, 'Farg‘ona'],
    [41.04, 73.01, 'Nurafshon'],
  ]

  const out: FuelStation[] = []
  corridors.forEach(([lat, lng, city], idx) => {
    for (let s = 0; s < 8; s++) {
      const t = s / 8
      const next = corridors[(idx + 1) % corridors.length]
      const lat2 = lat + (next[0] - lat) * t + (seededRandom(idx * 100 + s) - 0.5) * 0.05
      const lng2 = lng + (next[1] - lng) * t + (seededRandom(idx * 100 + s + 50) - 0.5) * 0.05
      out.push(
        buildStation({
          id: `hw-${idx}-${s}`,
          name: `Yo‘l zapravkasi ${idx}-${s}`,
          brand: 'TruckFuel',
          city,
          address: `M-${idx} yo‘li`,
          lat: lat2,
          lng: lng2,
          prices: FUEL_SETS[s % FUEL_SETS.length] as PriceInput[],
          is24h: s % 3 === 0,
        }),
      )
    }
  })
  return out
}

const CITY_COUNTS: Record<string, number> = {
  Toshkent: 25,
  Nurafshon: 12,
  Samarqand: 18,
  Buxoro: 14,
  'Farg‘ona': 14,
  Andijon: 14,
  Namangan: 12,
  Qarshi: 10,
  Termiz: 10,
  Navoiy: 10,
  Jizzax: 10,
  Guliston: 8,
  Nukus: 10,
  Urganch: 10,
  Xiva: 8,
  Shahrisabz: 8,
  Uchquduq: 6,
}

export function generateAllMockStations(): FuelStation[] {
  const cities = UZBEKISTAN_CITIES.filter((c) => c.id !== 'all')
  const fromCities = cities.flatMap((c) =>
    generateForCity(c.name, c.lat, c.lng, CITY_COUNTS[c.name] ?? 10),
  )
  const highways = generateHighwayStations()
  return [...fromCities, ...highways]
}
