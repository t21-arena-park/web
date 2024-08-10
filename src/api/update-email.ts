import { api } from '@/lib/axios'

export type UpdateEmailBody = {
  email: string
  currentPassword: string
}

export async function updateEmail({ email, currentPassword }: UpdateEmailBody) {
  await api.patch('/update-email', {
    email,
    currentPassword,
  })
}
