import { api } from '@/lib/axios'

import Cookies from 'js-cookie'

export async function signOut() {
  try {
    await api.post('/sign-out')
  } finally {
    Cookies.remove('auth', { path: '/' })
  }
}
