import { api } from '@/lib/axios'

export interface GetOrganizationResponse {
  id: string
  name: string
  domain: string
  default_password: string
  address?: {
    id: number
    street?: string
    neighborhood?: string
    zipcode?: string
    complement?: string
    number?: string
    city?: string
    uf?: string
    country?: string
  }
  owner: {
    name: string
  }
}

export async function getOrganization() {
  const response = await api.get<GetOrganizationResponse>('/orgs')

  return response.data
}
