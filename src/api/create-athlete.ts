import { api } from '@/lib/axios'

export interface CreateAthleteBody {
  name: string
  birthDate: string
  handedness: 'RIGHT' | 'LEFT' | 'none'
  gender: 'MALE' | 'FEMALE' | 'none'
  status: boolean
  guardianName: string
  bloodType:
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE'
    | 'none'
}

export async function createAthlete({
  name,
  birthDate,
  bloodType,
  gender,
  guardianName,
  handedness,
  status,
}: CreateAthleteBody) {
  const response = await api.post('/athletes', {
    name,
    birthDate,
    bloodType,
    gender,
    guardianName,
    handedness,
    status,
  })

  return response.data
}
