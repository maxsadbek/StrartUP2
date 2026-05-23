export type NotificationType = 'price' | 'delivery' | 'favorite' | 'system' | 'promo'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}
