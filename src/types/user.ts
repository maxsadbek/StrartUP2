export type UserRole = 'driver' | 'taxi' | 'commuter'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  role: UserRole
  isTaxiMode: boolean
  vehiclePlate?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  phone?: string
}
