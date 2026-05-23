export const queryKeys = {
  stations: {
    all: ['stations'] as const,
    list: (filters?: Record<string, unknown>) => ['stations', 'list', filters] as const,
    detail: (id: string) => ['stations', 'detail', id] as const,
    reviews: (id: string) => ['stations', 'reviews', id] as const,
  },
  market: {
    prices: ['market', 'prices'] as const,
    trends: ['market', 'trends'] as const,
  },
  delivery: {
    orders: ['delivery', 'orders'] as const,
    order: (id: string) => ['delivery', 'order', id] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
  },
} as const
