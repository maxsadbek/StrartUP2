import type { DeliveryOrder, DeliveryRequest } from '@/types/delivery'

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

let mockOrders: DeliveryOrder[] = [
  {
    id: 'del-001',
    stationId: 'st-001',
    stationName: 'FuelGo Central',
    fuelType: 'diesel',
    liters: 40,
    address: '45 Amir Temur Ave, Office 12',
    lat: 41.3111,
    lng: 69.2797,
    estimatedMinutes: 18,
    totalPrice: 392000,
    status: 'en_route',
    paymentMethod: 'FuelGo Wallet',
    createdAt: new Date().toISOString(),
  },
]

export const deliveryService = {
  async getOrders(): Promise<DeliveryOrder[]> {
    await delay()
    return mockOrders
  },

  async createOrder(request: DeliveryRequest): Promise<DeliveryOrder> {
    await delay(700)
    const order: DeliveryOrder = {
      id: `del-${Date.now()}`,
      stationId: request.stationId,
      stationName: 'Station',
      fuelType: request.fuelType,
      liters: request.liters,
      address: request.address,
      lat: request.lat,
      lng: request.lng,
      estimatedMinutes: 25,
      totalPrice: request.liters * 10000,
      status: 'confirmed',
      paymentMethod: request.paymentMethod,
      createdAt: new Date().toISOString(),
    }
    mockOrders = [order, ...mockOrders]
    return order
  },
}
