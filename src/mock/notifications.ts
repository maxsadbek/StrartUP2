import type { AppNotification } from '@/types/notification'

export const mockNotifications: AppNotification[] = [
  { id: 'n1', type: 'price', title: 'Price drop nearby', message: 'AI-95 at Night Owl Station dropped to 11,280 UZS', read: false, createdAt: '2026-05-23T08:00:00Z', link: '/station/st-005' },
  { id: 'n2', type: 'delivery', title: 'Delivery on the way', message: 'Your 40L diesel order arrives in ~18 min', read: false, createdAt: '2026-05-23T07:45:00Z', link: '/delivery' },
  { id: 'n3', type: 'favorite', title: 'Green Fuel Hub is open', message: 'Your favorite station has no queue right now', read: true, createdAt: '2026-05-22T20:00:00Z', link: '/station/st-003' },
  { id: 'n4', type: 'promo', title: 'Taxi driver bonus', message: 'Earn 2x points on fuel this weekend', read: true, createdAt: '2026-05-22T12:00:00Z' },
  { id: 'n5', type: 'system', title: 'App updated', message: 'New AI recommendations and map filters available', read: true, createdAt: '2026-05-21T09:00:00Z' },
]
