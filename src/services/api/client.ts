import axios from 'axios'
import { env } from '@/constants/env'
import { setupInterceptors } from './interceptors'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

setupInterceptors(apiClient)
