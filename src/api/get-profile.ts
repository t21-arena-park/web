import { api } from '@/lib/axios'

export interface GetProfileResponse {
  id: string
  name: string
  initials: string
  email: string
  status: boolean
  birthDate?: string
  gender?: 'MALE' | 'FEMALE'
  cpf?: string
  phone?: string
  role: 'ADMINISTRATOR' | 'VOLUNTEER'
  created_at: string
  area:
    | 'UNSPECIFIED'
    | 'PSYCHOLOGY'
    | 'PHYSIOTHERAPY'
    | 'NUTRITION'
    | 'NURSING'
    | 'PSYCHOPEDAGOGY'
    | 'PHYSICAL_EDUCATION'
  address?: {
    id: number
    street?: string
    neighborhood?: string
    zipcode?: string
    state?: string
    complement?: string
    number?: string
    city?: string
    uf?: string
    country?: string
  }

  currentPassword: string // Só pra atualizar o cache
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/me')

  return response.data
}
