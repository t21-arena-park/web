import { api } from '@/lib/axios'

export type CreateVolunteerBody = {
  name: string
  email: string
  password: string
  phone?: string
  area:
    | 'UNSPECIFIED'
    | 'PSYCHOLOGY'
    | 'PHYSIOTHERAPY'
    | 'NUTRITION'
    | 'NURSING'
    | 'PSYCHOPEDAGOGY'
    | 'PHYSICAL_EDUCATION'
  role: 'VOLUNTEER'
}

export async function createVolunteer({
  name,
  area,
  email,
  password,
  phone,
  role,
}: CreateVolunteerBody) {
  await api.post(`/volunteers`, {
    name,
    email,
    area,
    password,
    phone,
    role,
  })
}
