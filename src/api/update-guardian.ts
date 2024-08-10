/* eslint-disable camelcase */
import { api } from '@/lib/axios'

export interface UpdateGuardianAddressParams {
  id: string
  name?: string
  email?: string
  relationship_degree?: string
  cpf?: string
  rg?: string
  gender: 'MALE' | 'FEMALE' | 'none'
}

export async function updateGuardian({
  id,
  name,
  email,
  relationship_degree,
  rg,
  cpf,
  gender,
}: UpdateGuardianAddressParams) {
  await api.patch(`/guardians/${id}`, {
    name,
    email,
    relationship_degree,
    rg,
    cpf,
    gender: gender === 'none' ? null : gender,
  })
}
