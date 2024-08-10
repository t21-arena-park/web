import { api } from '@/lib/axios'

export interface GetGuardiansAmountBody {
  amount: number
}

export async function getGuardiansAmount() {
  const response = await api.get<GetGuardiansAmountBody>(
    '/metrics/guardians-amount',
  )

  return response.data
}
