import * as Tabs from '@radix-ui/react-tabs'

import { Label } from '@/components/ui/label'

import {
  ChevronRight,
  KeyRound,
  Loader2Icon,
  Lock,
  Mail,
  UserRound,
} from 'lucide-react'

import { Helmet } from 'react-helmet-async'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { UpdateEmailDialog } from './update-email-dialog'

import { UpdatePasswordDialog } from './update-password-dialog'

import { useQuery, useMutation } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'

import { getProfile } from '@/api/get-profile'

import { Control, Input } from '@/components/ui/input'

import { z } from 'zod'

import { Controller, useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { AxiosError } from 'axios'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'

import { updateProfile } from '@/api/update-profile'

const userSchema = z.object({
  name: z.string().min(1, { message: 'Nome não pode ser vazio' }),
  cpf: z.string().min(1, { message: 'CPF não pode ser vazio' }),
  email: z.string(),
  phone: z.string(),
  birthDate: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'none']),
  address: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    zipcode: z.string(),
    neighborhood: z.string(),
    country: z.string(),
    uf: z.string(),
    complement: z.string(),
  }),
})

type userFormSchema = z.infer<typeof userSchema>

export function Profile() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { mutateAsync: updateUserFn } = useMutation({
    mutationFn: updateProfile,
  })

  async function handleUpdateUser(data: userFormSchema) {
    try {
      await updateUserFn(data)

      toast.success('Os dados da sua conta foram atualizados com sucesso.')
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

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<userFormSchema>({
    resolver: zodResolver(userSchema),

    values: {
      name: profile?.name || '',
      cpf: profile?.cpf || '',
      email: profile?.email || '',
      birthDate: profile?.birthDate
        ? new Date(profile.birthDate).toISOString().split('T')[0]
        : '',
      gender: profile?.gender || 'none',
      phone: profile?.phone || '',
      address: {
        street: profile?.address?.street || '',
        number: profile?.address?.number || '',
        city: profile?.address?.city || '',
        zipcode: profile?.address?.zipcode || '',
        neighborhood: profile?.address?.neighborhood || '',
        country: profile?.address?.country || '',
        uf: profile?.address?.uf || '',
        complement: profile?.address?.complement || '',
      },
    },
  })

  return (
    <>
      <Helmet title="Minha conta" />

      <div className="flex flex-col max-w-[1352px] p-6 pb-10 gap-10 mx-auto">
        <div className="grid items-start gap-y-10 gap-x-6 w-full mt-10 mx-auto mb-11">
          <div className="col-span-full flex flex-col gap-1">
            <h1 className="font-bold font-error text-2xl">Minha conta</h1>
            <p className="text-sm text-slate-400">
              Gerencie as informações da contas e dados pessoais.
            </p>
          </div>

          <Tabs.Root
            defaultValue="tab-auth"
            className="grid lg:grid-cols-[321px_1fr] items-start lg:gap-8"
          >
            <Tabs.List
              asChild
              className="flex rounded-md px-0 border border-slate-700 col-span-full lg:col-span-1 lg:flex-col lg:py-4 grid-auto-flow p-0 overflow-hidden border-b border-b-slate-700"
            >
              <aside className="flex lg:flex-col">
                <Tabs.Trigger
                  value="tab-auth"
                  className="flex items-center py-4 px-0 justify-center flex-1 lg:justify-start lg:py-[.875rem] lg:px-6 transition-colors text-slate-400 font-normal data-[state=active]:font-semibold data-[state=active]:text-slate-200 data-[state=active]:bg-slate-800 [&[data-state=active]>svg]:text-lime-500 data-[state=active]:border-b-2 data-[state=active]:border-b-lime-500 lg:data-[state=active]:border-b-0 lg:data-[state=active]:border-l-2 lg:data-[state=active]:border-l-lime-500"
                >
                  <KeyRound className="size-5" />

                  <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                    Dados de acesso
                  </span>

                  <ChevronRight className="size-4 hidden lg:inline" />
                </Tabs.Trigger>

                <Tabs.Trigger
                  value="tab-personal"
                  className="flex items-center py-4 px-0 justify-center flex-1 lg:justify-start lg:py-[.875rem] lg:px-6 transition-colors text-slate-400 font-normal data-[state=active]:font-semibold data-[state=active]:text-slate-200 data-[state=active]:bg-slate-800 [&[data-state=active]>svg]:text-lime-500 data-[state=active]:border-b-2 data-[state=active]:border-b-lime-500 lg:data-[state=active]:border-b-0 lg:data-[state=active]:border-l-2 lg:data-[state=active]:border-l-lime-500"
                >
                  <UserRound className="size-5" />

                  <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                    Dados pessoais
                  </span>

                  <ChevronRight className="size-4 hidden lg:inline" />
                </Tabs.Trigger>
              </aside>
            </Tabs.List>

            <main className="mt-10 lg:mt-0">
              <Tabs.Content value="tab-auth">
                <div className="flex items-center gap-3 mb-8">
                  <KeyRound className="size-5" />

                  <h2 className="text-xl">Dados de acesso</h2>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md">
                    <section className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-y-6 lg:gap-x-3 ">
                      <Dialog>
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="email"
                            className="inline-block text-slate-400"
                          >
                            E-mail
                          </Label>

                          <div className="border-0 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                            <Mail className="size-5 text-slate-600" />

                            {isLoadingProfile ? (
                              <Skeleton className="w-[200px] ml-2 rounded-sm mr-auto bg-slate-800 h-5" />
                            ) : (
                              <div
                                className="text-slate-400 w-full h-full flex items-center ml-2 cursor-not-allowed"
                                id="email"
                              >
                                {profile?.email}
                              </div>
                            )}

                            <DialogTrigger asChild>
                              <button
                                type="button"
                                className="text-sm text-lime-400"
                              >
                                Alterar
                              </button>
                            </DialogTrigger>
                          </div>
                        </div>

                        <UpdateEmailDialog email={profile?.email} />
                      </Dialog>

                      <Dialog>
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="password"
                            className="inline-block text-slate-400"
                          >
                            Senha
                          </Label>

                          <div className="border-0 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                            <Lock className="size-5 text-slate-600" />

                            {isLoadingProfile ? (
                              <Skeleton className="w-[200px] ml-2 rounded-sm mr-auto bg-slate-800 h-5" />
                            ) : (
                              <div
                                className="text-slate-400 w-full h-full flex items-center ml-2 cursor-not-allowed"
                                id="email"
                              >
                                •••••••••
                              </div>
                            )}

                            <DialogTrigger asChild>
                              <button
                                type="button"
                                className="text-sm text-lime-400"
                              >
                                Alterar
                              </button>
                            </DialogTrigger>

                            <UpdatePasswordDialog />
                          </div>
                        </div>
                      </Dialog>
                    </section>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="tab-personal">
                <div className="flex items-center gap-3 mb-8">
                  <UserRound className="size-5" />

                  <h2 className="text-xl">Dados pessoais</h2>
                </div>

                <form
                  className="w-full flex flex-col gap-4"
                  onSubmit={handleSubmit(handleUpdateUser)}
                >
                  <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md">
                    <div className="w-full space-y-6">
                      <section className="grid lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[2fr_1fr]">
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="name"
                            className="inline-block text-slate-400"
                          >
                            Nome
                          </Label>

                          <Input variant="default">
                            <Control type="text" {...register('name')} />
                          </Input>
                          {errors.name && (
                            <span className="text-sm font-medium text-red-500">
                              {errors.name.message}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="cpf"
                            className="inline-block text-slate-400"
                          >
                            CPF
                          </Label>

                          <Input variant="default">
                            <Control
                              type="text"
                              {...register('cpf')}
                              placeholder="999.999.999-99"
                            />
                          </Input>
                          {errors.cpf && (
                            <span className="text-sm font-medium text-red-500">
                              {errors.cpf.message}
                            </span>
                          )}
                        </div>
                      </section>

                      <section className="grid lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[2fr_1fr]">
                        <div className="grid lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[2fr_1fr]">
                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="birthDate"
                              className="inline-block text-slate-400"
                            >
                              Nascimento
                            </Label>

                            <Input variant="default">
                              <Control
                                type="date"
                                placeholder="99/99/9999"
                                {...register('birthDate')}
                              />
                            </Input>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="birthDate"
                              className="inline-block text-slate-400"
                            >
                              Gênero
                            </Label>

                            <Controller
                              name="gender"
                              control={control}
                              render={({
                                field: { onChange, value, disabled },
                              }) => (
                                <Select
                                  defaultValue="none"
                                  onValueChange={onChange}
                                  value={value}
                                  disabled={disabled}
                                  {...register('gender')}
                                >
                                  <SelectTrigger className="h-12 w-full lg:w-[300px] bg-slate-900 text-base">
                                    <SelectValue />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectItem value="none">
                                      Selecione uma opção
                                    </SelectItem>

                                    <SelectItem value="MALE">
                                      Masculino
                                    </SelectItem>

                                    <SelectItem value="FEMALE">
                                      Feminino
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            ></Controller>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="phone"
                            className="inline-block text-slate-400"
                          >
                            Telefone
                          </Label>

                          <Input variant="default">
                            <Control
                              type="text"
                              {...register('phone')}
                              placeholder="(99) 99999-9999"
                            />
                          </Input>
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
                          <Control
                            type="text"
                            {...register('address.zipcode')}
                            placeholder="99999-999"
                          />
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
                          <Control
                            type="text"
                            {...register('address.street')}
                            placeholder="Nome da rua"
                          />
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
                          <Control
                            type="number"
                            {...register('address.number')}
                            placeholder="000"
                          />
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
                          <Control
                            type="text"
                            {...register('address.complement')}
                            placeholder="Casa, Apto etc"
                          />
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
                          <Control
                            type="text"
                            {...register('address.neighborhood')}
                            placeholder="Nome do bairro"
                          />
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
                          <Control
                            type="text"
                            {...register('address.city')}
                            placeholder="Nome da cidade"
                          />
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
                          <Control
                            type="text"
                            maxLength={2}
                            placeholder="XX"
                            {...register('address.uf')}
                          />
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
            </main>
          </Tabs.Root>
        </div>
      </div>
    </>
  )
}
