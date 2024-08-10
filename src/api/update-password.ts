import { api } from '@/lib/axios'

export type UpdatePasswordBody = {
  newPassword: string
  currentPassword: string
}

export async function updatePassword({
  newPassword,
  currentPassword,
}: UpdatePasswordBody) {
  await api.patch('/update-password', {
    newPassword,
    currentPassword,
  })
}
