import { api } from '@/lib/axios'

export interface GetAthleteProfileParams {
  id: string
}

export interface GetAthleteProfileBody {
  id: string
  name: string
  status: 'active' | 'inactive'
  birth_date: string
  created_at: string
  blood_type:
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE'

  gender: 'MALE' | 'FEMALE'
  handedness: 'RIGHT' | 'LEFT'

  guardian: {
    id: string
    name: string
    email: string
    relationship_degree: string
    cpf: string
    rg: string
    gender: 'MALE' | 'FEMALE'
  }

  anamnesis: {
    athlete_id: string
    created_at: string
    id: string
    updated_at: string
  }

  initials: string
}

export async function getAthleteProfile({ id }: GetAthleteProfileParams) {
  const response = await api.get<GetAthleteProfileBody | undefined>(
    `/athletes/${id}`,
  )
  return response.data
}
