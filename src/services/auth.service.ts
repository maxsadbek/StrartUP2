import type { LoginCredentials, RegisterData, User } from '@/types/user'
import { demoUser } from '@/store/authStore'

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay()
    if (!credentials.email || !credentials.password) {
      throw new Error('Invalid credentials')
    }
    return { user: { ...demoUser, email: credentials.email }, token: 'mock-jwt-token' }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await delay(800)
    return {
      user: { ...demoUser, email: data.email, name: data.name, phone: data.phone },
      token: 'mock-jwt-token',
    }
  },
}
