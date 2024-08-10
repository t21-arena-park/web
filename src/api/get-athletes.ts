import { api } from '@/lib/axios'

export interface GetAthletesQuery {
  pageIndex?: number | null
  athleteName: string | null
  status: string | null
}

export interface GetAthletesResponse {
  athletes: {
    id: string
    age: number
    status: 'active' | 'inactive'
    name: string
    birth_date: Date
    blood_type:
      | 'a_positive'
      | 'a_negative'
      | 'b_positive'
      | 'b_negative'
      | 'ab_positive'
      | 'ab_negative'
      | 'o_positive'
      | 'o_negative'
    gender: 'male' | 'female'
    handedness: 'right' | 'left'
  }[]

  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getAthletes({
  pageIndex,
  athleteName,
  status,
}: GetAthletesQuery) {
  const response = await api.get<GetAthletesResponse>('/athletes', {
    params: {
      pageIndex,
      athleteName,
      status,
    },
  })

  return response.data
}
