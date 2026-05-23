export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  map: '/map',
  stations: '/stations',
  station: (id: string) => `/station/${id}`,
  favorites: '/favorites',
  delivery: '/delivery',
  profile: '/profile',
  settings: '/settings',
  notifications: '/notifications',
} as const
