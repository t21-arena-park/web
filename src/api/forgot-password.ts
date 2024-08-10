import { api } from '@/lib/axios'

export type ForgotPasswordBody = {
  email: string
  newPassword: string
}

export async function forgotPassword({
  email,
  newPassword,
}: ForgotPasswordBody) {
  await api.patch('/forgot-password', {
    email,
    newPassword,
  })
}
