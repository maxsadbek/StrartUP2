import { getNearestCityName } from '@/utils/geo'
import type { FuelStation, FuelPrice, FuelType } from '@/types/station'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

interface OsmElement {
  type: 'node' | 'way'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

interface OsmResponse {
  elements: OsmElement[]
}

const CACHE_KEY = 'fuelgo-osm-stations-v1'

function parseFuelTypes(tags: Record<string, string>): FuelPrice[] {
  const prices: FuelPrice[] = []
  const now = new Date().toISOString()
  const fuel = tags.fuel || tags['fuel:octane'] || ''

  const add = (type: FuelType, label: string, price: number) => {
    prices.push({ type, label, price, available: true, updatedAt: now })
  }

  if (fuel.includes('cng') || tags['fuel:cng'] === 'yes' || tags.compressed_air === 'yes') {
    add('metan', 'Metan', 3100)
  }
  if (fuel.includes('lpg') || tags['fuel:lpg'] === 'yes' || tags['fuel:propane'] === 'yes') {
    add('propan', 'Propan', 4600)
  }
  if (fuel.includes('diesel') || tags['fuel:diesel'] === 'yes') {
    add('diesel', 'Dizel', 9800)
  }
  if (fuel.includes('octane_95') || fuel.includes('95')) {
    add('ai95', 'AI-95', 11300)
  }
  if (fuel.includes('octane_98') || fuel.includes('98')) {
    add('ai98', 'AI-98', 12600)
  }

  if (prices.length === 0 || fuel.includes('octane_92') || fuel.includes('gasoline') || !fuel) {
    add('ai92', 'AI-92', 10100)
    if (!prices.some((p) => p.type === 'ai95')) add('ai95', 'AI-95', 11300)
  }

  return prices
}

function osmToStation(el: OsmElement): FuelStation | null {
  const lat = el.lat ?? el.center?.lat
  const lng = el.lon ?? el.center?.lon
  if (lat == null || lng == null) return null

  const tags = el.tags ?? {}
  const name =
    tags.name ||
    tags['name:uz'] ||
    tags['name:ru'] ||
    tags.brand ||
    tags.operator ||
    'Zapravka'

  const city = getNearestCityName(lat, lng)
  const seed = el.id % 1000

  return {
    id: `osm-${el.type}-${el.id}`,
    name,
    brand: tags.brand || tags.operator || 'OSM',
    address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || city,
    city,
    lat,
    lng,
    distance: 0,
    rating: 4.0 + (seed % 10) / 10,
    reviewCount: 20 + (seed % 200),
    queueMinutes: seed % 12,
    isOpen: true,
    is24h: tags.opening_hours === '24/7',
    images: [`https://picsum.photos/seed/osm-${el.id}/400/300`],
    services: ['OSM ma\'lumot'],
    prices: parseFuelTypes(tags),
  }
}

export async function fetchOsmFuelStations(): Promise<FuelStation[]> {
  const cached = sessionStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached) as FuelStation[]
    } catch {
      sessionStorage.removeItem(CACHE_KEY)
    }
  }

  const query = `
    [out:json][timeout:90];
    area["ISO3166-1"="UZ"][admin_level=2];
    (
      node["amenity"="fuel"](area);
      node["amenity"="gas_station"](area);
      way["amenity"="fuel"](area);
      way["amenity"="gas_station"](area);
    );
    out center;
  `

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  })

  if (!res.ok) throw new Error(`Overpass ${res.status}`)

  const data = (await res.json()) as OsmResponse
  const stations = data.elements
    .map(osmToStation)
    .filter((s): s is FuelStation => s !== null)

  if (stations.length > 0) {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(stations))
  }

  return stations
}
