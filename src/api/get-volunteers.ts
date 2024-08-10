import { api } from '@/lib/axios'

export interface GetVolunteersResponse {
  volunteers: {
    id: string
    name: string
    email: string
    phone?: string
    access_date: string
    created_at: Date
    area:
      | 'unspecified'
      | 'psychology'
      | 'physiotherapy'
      | 'nutrition'
      | 'nursing'
      | 'psychopedagogy'
      | 'physical_education'
    status: boolean
  }[]
}

export async function getVolunteers() {
  const response = await api.get<GetVolunteersResponse>('/volunteers')

  return response.data
}
