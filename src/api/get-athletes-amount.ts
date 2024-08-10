import { api } from '@/lib/axios'

export interface GetAthletesAmountBody {
  amount: number
}

export async function getAthletesAmount() {
  const response = await api.get<GetAthletesAmountBody>(
    '/metrics/athletes-amount',
  )

  return response.data
}
