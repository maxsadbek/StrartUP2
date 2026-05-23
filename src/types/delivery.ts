import type { FuelType } from './station'

export type DeliveryStatus =
  | 'pending'
  | 'confirmed'
  | 'dispatched'
  | 'en_route'
  | 'delivered'
  | 'cancelled'

export interface DeliveryOrder {
  id: string
  stationId: string
  stationName: string
  fuelType: FuelType
  liters: number
  address: string
  lat: number
  lng: number
  estimatedMinutes: number
  totalPrice: number
  status: DeliveryStatus
  paymentMethod: string
  createdAt: string
}

export interface DeliveryRequest {
  stationId: string
  fuelType: FuelType
  liters: number
  address: string
  lat: number
  lng: number
  paymentMethod: string
}
