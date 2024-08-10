import { api } from '@/lib/axios'

export type UpdateVolunteerBody = {
  id: string
  name: string
  area:
    | 'UNSPECIFIED'
    | 'PSYCHOLOGY'
    | 'PHYSIOTHERAPY'
    | 'NUTRITION'
    | 'NURSING'
    | 'PSYCHOPEDAGOGY'
    | 'PHYSICAL_EDUCATION'
}

export async function updateVolunteer({ id, name, area }: UpdateVolunteerBody) {
  await api.put(`/volunteers/${id}`, {
    name,
    area,
  })
}
