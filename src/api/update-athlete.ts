/* eslint-disable camelcase */
import { api } from '@/lib/axios'

export interface UpdateAthleteParams {
  id: string
  name: string
  birth_date: string
  blood_type:
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE'
    | 'none'
  gender: 'MALE' | 'FEMALE' | 'none'
  handedness: 'RIGHT' | 'LEFT' | 'none'
}

export async function updateAthlete({
  id,
  gender,
  name,
  birth_date,
  handedness,
  blood_type,
}: UpdateAthleteParams) {
  await api.patch(`/athletes/${id}`, {
    gender: gender === 'none' ? null : gender,
    name,
    birthDate: birth_date,
    handedness: handedness === 'none' ? null : handedness,
    bloodType: blood_type === 'none' ? null : blood_type,
  })
}
