import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setTaxiMode: (enabled: boolean) => void
  updateUser: (partial: Partial<User>) => void
}

const demoUser: User = {
  id: 'u-001',
  email: 'driver@fuelgo.app',
  name: 'Alex Morgan',
  avatar: undefined,
  phone: '+998 90 123 4567',
  role: 'taxi',
  isTaxiMode: false,
  vehiclePlate: '01 A 777 BB',
  createdAt: '2025-01-15T00:00:00Z',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setTaxiMode: (enabled) =>
        set((s) => (s.user ? { user: { ...s.user, isTaxiMode: enabled } } : {})),
      updateUser: (partial) =>
        set((s) => (s.user ? { user: { ...s.user, ...partial } } : {})),
    }),
    { name: 'fuelgo-auth' },
  ),
)

export { demoUser }
