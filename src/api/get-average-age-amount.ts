import { api } from '@/lib/axios'

export interface GetAverageAgeAmountBody {
  amount: number
}

export async function getAverageAgeAmount() {
  const response = await api.get<GetAverageAgeAmountBody>(
    '/metrics/average-age-amount',
  )

  return response.data
}
