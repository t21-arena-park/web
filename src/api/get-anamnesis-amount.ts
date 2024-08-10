import { api } from '@/lib/axios'

export interface GetAnamnesisAmountBody {
  amount: number
}

export async function getAnamnesisAmount() {
  const response = await api.get<GetAnamnesisAmountBody>(
    '/metrics/anamnesis-amount',
  )

  return response.data
}
