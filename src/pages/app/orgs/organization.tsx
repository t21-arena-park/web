import { Helmet } from 'react-helmet-async'

import * as Tabs from '@radix-ui/react-tabs'

import {
  ChevronRight,
  Eye,
  EyeOff,
  Handshake,
  Loader2Icon,
  Settings,
} from 'lucide-react'

import { Label } from '@/components/ui/label'

import { Skeleton } from '@/components/ui/skeleton'

import { z } from 'zod'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getOrganization } from '@/api/get-organization'

import { updateOrganization } from '@/api/update-organization'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { AxiosError } from 'axios'

import { toast } from 'sonner'

import { Control, Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { GetVolunteersResponse, getVolunteers } from '@/api/get-volunteers'

import { deleteVolunteer } from '@/api/delete-volunteer'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { OrganizationVolunteerSkeleton } from './organization-volunteer-skeleton'

import { areaMap } from '@/utils/i18n'

import { UpdateVolunteerDialog } from './update-volunteer-dialog'
import { CreateVolunteerDialog } from './create-volunteer-dialog'

import { useState } from 'react'

const organizationSchema = z.object({
  street: z.string(),
  number: z.string(),
  city: z.string(),
  zipcode: z.string(),
  country: z.string(),
  uf: z.string(),
  neighborhood: z.string(),
  complement: z.string(),
})

type OrganizationFormSchema = z.infer<typeof organizationSchema>

export function Organization() {
  const [isShowingPassword, setIsShowingPassword] = useState(false)

  const { data: organization, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ['organization'],
    queryFn: getOrganization,
  })

  const { mutateAsync: updateOrgFn } = useMutation({
    mutationFn: updateOrganization,
  })

  async function handleUpdateOrganization(data: OrganizationFormSchema) {
    try {
      await updateOrgFn(data)

      toast.success(
        'Os dados da sua organização forma atualizados com sucesso.',
      )
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('Aconteceu um erro inesperado.')
        }
      } else {
        toast.error(`Aconteceu um erro: ${error}`)
      }
    }
  }

  const queryClient = useQueryClient()

  const { data: result, isLoading: isLoadingVolunteers } = useQuery({
    queryKey: ['volunteers'],
    queryFn: getVolunteers,
  })

  function updateVolunteerOnCache(volunteerId: string) {
    const volunteersListCache =
      queryClient.getQueriesData<GetVolunteersResponse>({
        queryKey: ['volunteers'],
      })

    for (const [cacheKey, cacheData] of volunteersListCache) {
      if (!cacheData) return

      queryClient.setQueryData<GetVolunteersResponse>(cacheKey, {
        ...cacheData,

        volunteers: cacheData.volunteers.map((volunteer) => {
          if (volunteer.id === volunteerId) {
            return {
              ...volunteer,

              status: false,
            }
          }

          return volunteer
        }),
      })
    }
  }

  const { mutateAsync: deleteVolunteerFn } = useMutation({
    mutationFn: deleteVolunteer,

    async onSuccess(_, { volunteerId }) {
      updateVolunteerOnCache(volunteerId)

      queryClient.invalidateQueries({
        queryKey: ['volunteers'],
      })

      toast.success('Voluntário deletado com sucesso!')
    },

    async onError() {
      toast.error('Erro ao deletar voluntário.')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<OrganizationFormSchema>({
    resolver: zodResolver(organizationSchema),

    values: {
      street: organization?.address?.street ?? '',
      number: organization?.address?.number ?? '',
      city: organization?.address?.city ?? '',
      zipcode: organization?.address?.zipcode ?? '',
      country: organization?.address?.country ?? '',
      uf: organization?.address?.uf ?? '',
      neighborhood: organization?.address?.neighborhood ?? '',
      complement: organization?.address?.complement ?? '',
    },
  })

  return (
    <>
      <Helmet title="Minha organização" />

      <div className="flex flex-col max-w-[1352px] p-6 pb-10 gap-10 mx-auto">
        <div className="grid items-start gap-y-10 gap-x-6 w-full mt-10 mx-auto mb-11">
          <div className="col-span-full flex flex-col gap-1">
            <h1 className="font-bold font-error text-2xl">Minha organização</h1>
            <p className="text-sm text-slate-400">
              Gerencie as informações da organização e voluntários.
            </p>
          </div>

          <Tabs.Root
            defaultValue="tab-general"
            className="grid lg:grid-cols-[321px_1fr] items-start lg:gap-8"
          >
            <Tabs.List
              asChild
              className="flex rounded-md px-0 border border-slate-700 col-span-full lg:col-span-1 lg:flex-col lg:py-4 grid-auto-flow p-0 overflow-hidden border-b border-b-slate-700"
            >
              <aside className="flex lg:flex-col">
                <Tabs.Trigger
                  value="tab-general"
                  className="flex items-center py-4 px-0 justify-center flex-1 lg:justify-start lg:py-[.875rem] lg:px-6 transition-colors text-slate-400 font-normal data-[state=active]:font-semibold data-[state=active]:text-slate-200 data-[state=active]:bg-slate-800 [&[data-state=active]>svg]:text-lime-500 data-[state=active]:border-b-2 data-[state=active]:border-b-lime-500 lg:data-[state=active]:border-b-0 lg:data-[state=active]:border-l-2 lg:data-[state=active]:border-l-lime-500"
                >
                  <Settings className="size-5" />

                  <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                    Dados da organização
                  </span>

                  <ChevronRight className="size-4 hidden lg:inline" />
                </Tabs.Trigger>

                <Tabs.Trigger
                  value="tab-volunteers"
                  className="flex items-center py-4 px-0 justify-center flex-1 lg:justify-start lg:py-[.875rem] lg:px-6 transition-colors text-slate-400 font-normal data-[state=active]:font-semibold data-[state=active]:text-slate-200 data-[state=active]:bg-slate-800 [&[data-state=active]>svg]:text-lime-500 data-[state=active]:border-b-2 data-[state=active]:border-b-lime-500 lg:data-[state=active]:border-b-0 lg:data-[state=active]:border-l-2 lg:data-[state=active]:border-l-lime-500"
                >
                  <Handshake className="size-5" />

                  <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                    Voluntários
                  </span>

                  <ChevronRight className="size-4 hidden lg:inline" />
                </Tabs.Trigger>
              </aside>
            </Tabs.List>

            <main className="mt-10 lg:mt-0">
              <Tabs.Content value="tab-general">
                <div className="flex items-center gap-3 mb-8">
                  <Settings className="size-5" />

                  <h2 className="text-xl">Dados da organização</h2>
                </div>

                <form
                  action=""
                  onSubmit={handleSubmit(handleUpdateOrganization)}
                  method="post"
                  className="w-full flex flex-col gap-4"
                >
                  <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md">
                    <div className="w-full space-y-6">
                      <section className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-y-6 lg:gap-x-3">
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor=""
                            className="inline-block text-slate-400"
                          >
                            Nome
                          </Label>

                          <div className="border border-slate-700 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                            {isLoadingOrganization ? (
                              <Skeleton className="w-[400px] rounded-sm mr-auto bg-slate-800 h-5" />
                            ) : (
                              <div className="text-slate-400 w-full h-full flex items-center cursor-not-allowed">
                                {organization?.name ?? 'Nome da organização'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor=""
                            className="inline-block text-slate-400"
                          >
                            Senha
                          </Label>

                          <div className="border border-slate-700 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                            {isLoadingOrganization ? (
                              <Skeleton className="w-[200px] rounded-sm mr-auto bg-slate-800 h-5" />
                            ) : (
                              <div className="text-slate-400 w-full h-full flex items-center cursor-not-allowed">
                                <span>
                                  {organization?.default_password &&
                                  !isShowingPassword
                                    ? '•••••••••'
                                    : 'T21-ARENA-PARK'}
                                </span>

                                <span className="flex ml-auto size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                                  <button type="button">
                                    {isShowingPassword ? (
                                      <EyeOff
                                        strokeWidth={1.75}
                                        onClick={() =>
                                          setIsShowingPassword(false)
                                        }
                                      />
                                    ) : (
                                      <Eye
                                        strokeWidth={1.75}
                                        onClick={() =>
                                          setIsShowingPassword(true)
                                        }
                                      />
                                    )}
                                  </button>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>

                      <section className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-y-6 lg:gap-x-3">
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor=""
                            className="inline-block text-slate-400"
                          >
                            Domínio
                          </Label>

                          <div className="border border-slate-700 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                            {isLoadingOrganization ? (
                              <Skeleton className="w-[400px] rounded-sm mr-auto bg-slate-800 h-5" />
                            ) : (
                              <div className="text-slate-400 w-full h-full flex items-center cursor-not-allowed">
                                {organization?.domain ?? 'Nome da organização'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor=""
                            className="inline-block text-slate-400"
                          >
                            Dono da organização
                          </Label>

                          <div className="border border-slate-700 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                            {isLoadingOrganization ? (
                              <Skeleton className="w-[200px] rounded-sm mr-auto bg-slate-800 h-5" />
                            ) : (
                              <div className="text-slate-400 w-full h-full flex items-center cursor-not-allowed">
                                {organization?.owner?.name ?? '-'}
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md space-y-6">
                    <div className="flex items-center border-b border-b-slate-700 mb-6">
                      <h3 className="text-base mb-3">Endereço</h3>
                    </div>

                    <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[180px_1fr]">
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="zipcode"
                          className="inline-block text-slate-400"
                        >
                          CEP
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[120px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              type="text"
                              {...register('zipcode')}
                              placeholder="99999-999"
                            />
                          )}
                        </Input>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="street"
                          className="inline-block text-slate-400"
                        >
                          Rua
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[400px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              type="text"
                              placeholder="Nome da rua"
                              {...register('street')}
                            />
                          )}
                        </Input>
                      </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[180px_1fr]">
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="number"
                          className="inline-block text-slate-400"
                        >
                          Número
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[120px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              type="number"
                              {...register('number')}
                              placeholder="000"
                            />
                          )}
                        </Input>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="complement"
                          className="inline-block text-slate-400"
                        >
                          Complemento
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[400px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              type="text"
                              placeholder="Casa, Apto, etc"
                              {...register('complement')}
                            />
                          )}
                        </Input>
                      </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[1fr_1fr_80px]">
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="neighborhood"
                          className="inline-block text-slate-400"
                        >
                          Bairro
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[240px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              type="text"
                              placeholder="Nome do bairro"
                              {...register('neighborhood')}
                            />
                          )}
                        </Input>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="city"
                          className="inline-block text-slate-400"
                        >
                          Cidade
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[240px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              placeholder="Nome da cidade"
                              type="text"
                              id="city-org"
                              {...register('city')}
                            />
                          )}
                        </Input>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="uf"
                          className="inline-block text-slate-400"
                        >
                          UF
                        </Label>

                        <Input variant="default">
                          {isLoadingOrganization ? (
                            <Skeleton className="w-[80px] rounded-sm mr-auto bg-slate-800 h-5" />
                          ) : (
                            <Control
                              placeholder="XX"
                              type="text"
                              maxLength={2}
                              {...register('uf')}
                            />
                          )}
                        </Input>
                      </div>
                    </section>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="self-end"
                    disabled={!isDirty || isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2Icon
                        strokeWidth={3}
                        className="animate-spin size-6"
                      />
                    )}

                    <span className="text-base leading-6">Salvar</span>
                  </Button>
                </form>
              </Tabs.Content>

              <Tabs.Content value="tab-volunteers">
                <div className="flex items-center gap-3 mb-8">
                  <Handshake className="size-5" />

                  <h2 className="text-xl">Dados da organização</h2>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-base">Voluntários ativos</h3>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="submit"
                        variant="primary"
                        size="xs"
                        className="px-5"
                      >
                        Adicionar
                      </Button>
                    </DialogTrigger>

                    <CreateVolunteerDialog />
                  </Dialog>
                </div>

                <section className="space-y-2">
                  {isLoadingVolunteers && <OrganizationVolunteerSkeleton />}

                  {result &&
                    result.volunteers.map((volunteer) => (
                      <div
                        key={volunteer.id}
                        className="border border-slate-700 p-6 rounded-md bg-slate-800/50 flex flex-row justify-between gap-5"
                      >
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
                          <div className="flex gap-4">
                            <div className="flex flex-col gap-1 min-w-[120px]">
                              <span className="text-slate-400 text-xs">
                                Nome
                              </span>

                              <strong className="text-sm">
                                {volunteer.name}
                              </strong>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-slate-400 text-xs">
                                E-mail
                              </span>

                              <strong className="text-sm">
                                {volunteer.email}
                              </strong>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-slate-400 text-xs">
                                Início de acesso
                              </span>

                              <strong className="text-sm">
                                {volunteer.access_date}
                              </strong>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-slate-400 text-xs">
                                Área
                              </span>
                              <strong className="text-sm">
                                {areaMap[volunteer.area]}
                              </strong>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="default"
                                  size="xs"
                                  className="px-3"
                                >
                                  Editar
                                </Button>
                              </DialogTrigger>

                              <UpdateVolunteerDialog
                                volunteerId={volunteer.id}
                                volunteerName={volunteer.name}
                                volunteerArea={
                                  volunteer.area.toUpperCase() as
                                    | 'UNSPECIFIED'
                                    | 'PSYCHOLOGY'
                                    | 'PHYSIOTHERAPY'
                                    | 'NUTRITION'
                                    | 'NURSING'
                                    | 'PSYCHOPEDAGOGY'
                                    | 'PHYSICAL_EDUCATION'
                                }
                              />
                            </Dialog>

                            <Button
                              type="button"
                              variant="default"
                              size="xs"
                              className="px-3 bg-red-500 text-red-950 enable:hover:bg-red-900 hover:bg-red-500"
                              disabled={result.volunteers.length === 1}
                              onClick={() =>
                                deleteVolunteerFn({ volunteerId: volunteer.id })
                              }
                            >
                              Deletar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </section>
              </Tabs.Content>
            </main>
          </Tabs.Root>
        </div>
      </div>
    </>
  )
}
