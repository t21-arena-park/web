import { api } from '@/lib/axios'

import Cookies from 'js-cookie'

export type SignInBody = {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post('/sessions', {
    email,
    password,
  })

  Cookies.set('auth', response.data.token, {
    path: '/',
    secure: true,
    sameSite: 'strict',
    expires: 7, // 7 dias
  })
}
