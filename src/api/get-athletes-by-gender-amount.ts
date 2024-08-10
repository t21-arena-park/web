import { api } from '@/lib/axios'

export type GetAthletesByGenderAmountBody = {
  gender: 'male' | 'female'
  amount: number
}[]

export async function getAthletesByGenderAmount() {
  const response = await api.get<GetAthletesByGenderAmountBody>(
    '/metrics/athletes-gender-amount',
  )

  return response.data
}
