import axios from 'axios'

import { env } from '@/env'

import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 1000)),
    )
    return config
  })
}
