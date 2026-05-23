import { create } from 'zustand'
import { mockNotifications } from '@/mock/notifications'
import type { AppNotification } from '@/types/notification'

interface NotificationsState {
  items: AppNotification[]
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  items: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,
  markRead: (id) =>
    set((s) => {
      const items = s.items.map((n) => (n.id === id ? { ...n, read: true } : n))
      return { items, unreadCount: items.filter((n) => !n.read).length }
    }),
  markAllRead: () =>
    set((s) => ({
      items: s.items.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}))
