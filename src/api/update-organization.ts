import { api } from '@/lib/axios'

export interface UpdateOrganizationAddressParams {
  street?: string
  neighborhood?: string
  zipcode?: string
  complement?: string
  number?: string
  city?: string
  uf?: string
  country?: string
}

export async function updateOrganization({
  street,
  neighborhood,
  zipcode,
  complement,
  number,
  city,
  uf,
  country,
}: UpdateOrganizationAddressParams) {
  await api.put(`/orgs`, {
    street,
    neighborhood,
    zipcode,
    complement,
    number,
    city,
    uf,
    country,
  })
}
