import type { FuelStation, FuelType } from '@/types/station'

const img = (seed: string) => `https://picsum.photos/seed/fuelgo-${seed}/800/500`
const now = () => new Date().toISOString()

type PriceInput = [FuelType, string, number]

export interface StationInput {
  id: string
  name: string
  brand: string
  city: string
  address: string
  lat: number
  lng: number
  prices: PriceInput[]
  queueMinutes?: number
  rating?: number
  reviewCount?: number
  isOpen?: boolean
  is24h?: boolean
  isPremium?: boolean
  services?: string[]
}

export function buildStation(input: StationInput): FuelStation {
  return {
    id: input.id,
    name: input.name,
    brand: input.brand,
    address: input.address,
    city: input.city,
    lat: input.lat,
    lng: input.lng,
    distance: 0,
    rating: input.rating ?? 4.2 + (input.id.length % 8) * 0.1,
    reviewCount: input.reviewCount ?? 100 + (input.id.charCodeAt(0) % 400),
    queueMinutes: input.queueMinutes ?? input.id.length % 12,
    isOpen: input.isOpen ?? true,
    is24h: input.is24h ?? false,
    isPremium: input.isPremium,
    images: [img(input.id)],
    services: input.services ?? ['Do‘kon'],
    prices: input.prices.map(([type, label, price]) => ({
      type,
      label,
      price,
      available: true,
      updatedAt: now(),
    })),
  }
}
