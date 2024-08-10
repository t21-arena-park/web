import { api } from '@/lib/axios'

export interface UpdateProfileAddressParams {
  name: string
  cpf: string
  email: string
  phone: string
  birthDate: string
  gender: string
  address: {
    street: string
    number: string
    city: string
    zipcode: string
    neighborhood: string
    country: string
    uf: string
    complement: string
  }
}

export async function updateProfile({
  name,
  cpf,
  email,
  phone,
  birthDate,
  gender,
  address: {
    street,
    number,
    city,
    zipcode,
    neighborhood,
    country,
    uf,
    complement,
  },
}: UpdateProfileAddressParams) {
  await api.put(`/me`, {
    name,
    cpf,
    email,
    phone,
    birthDate,
    gender,
    address: {
      street,
      number,
      city,
      zipcode,
      neighborhood,
      country,
      uf,
      complement,
    },
  })
}
