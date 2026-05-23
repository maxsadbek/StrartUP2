export type FuelType = 'ai92' | 'ai95' | 'ai98' | 'diesel' | 'gas'

export interface FuelPrice {
  type: FuelType
  label: string
  price: number
  available: boolean
  updatedAt: string
}

export interface StationReview {
  id: string
  author: string
  avatar?: string
  rating: number
  comment: string
  createdAt: string
}

export interface FuelStation {
  id: string
  name: string
  brand: string
  address: string
  city: string
  lat: number
  lng: number
  distance: number
  rating: number
  reviewCount: number
  queueMinutes: number
  isOpen: boolean
  is24h: boolean
  images: string[]
  prices: FuelPrice[]
  services: string[]
  isFavorite?: boolean
  isPremium?: boolean
}

export interface StationFilters {
  fuelTypes: FuelType[]
  maxDistance: number
  minRating: number
  openNow: boolean
  sortBy: 'distance' | 'price' | 'rating' | 'queue'
  search: string
}
