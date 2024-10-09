import { getAthleteProfile } from '@/api/get-athlete-profile'

import { Button } from '@/components/ui/button'

import { useMutation, useQuery } from '@tanstack/react-query'

import { Link, useParams } from 'react-router-dom'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { AthleteProfileDialog } from './athlete-profile-dialog'

import { AthleteProfileTermos } from './athlete-profile-termos'

import { AthleteProfileTermosImagem } from './athlete-profile-termosimagens'

import { Label } from '@/components/ui/label'

import { Input, Control } from '@/components/ui/input'

import {
  ArrowRight,
  Loader2Icon,
  BookHeart,
  ShieldCheck,
  Loader2,
  Plus,
  Download,
} from 'lucide-react'

import { bloodTypeMap, genderMap, handednessMap } from '@/utils/i18n'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Controller, useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { AxiosError } from 'axios'

import { updateGuardian } from '@/api/update-guardian'

import { Helmet } from 'react-helmet-async'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const updateGuardianSchema = z.object({
  name: z.string(),
  email: z.string(),
  relationship_degree: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'none']),
  rg: z.string(),
  cpf: z.string(),
})

type UpdateGuardianFormSchema = z.infer<typeof updateGuardianSchema>

export function AthleteProfile() {
  const params = useParams<{ id: string }>()

  const id = params.id ?? ''

  const { data: athlete, isLoading: isPageLoading } = useQuery({
    queryKey: ['athlete-profile', id],
    queryFn: () => getAthleteProfile({ id }),
    enabled: id !== '',
  })

  const { mutateAsync: updateGuardianFn } = useMutation({
    mutationFn: updateGuardian,
  })

  async function handleUpdateGuardian(
    data: UpdateGuardianFormSchema,
    guardianId: string | undefined,
  ) {
    try {
      if (guardianId) {
        await updateGuardianFn({ ...data, id: guardianId })
      }

      toast.success('Os dados do responsável foram atualizados com sucesso.')
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
    formState: { isDirty, isSubmitting },
  } = useForm<UpdateGuardianFormSchema>({
    resolver: zodResolver(updateGuardianSchema),

    values: {
      name: athlete?.guardian?.name ?? '',
      email: athlete?.guardian?.email ?? '',
      relationship_degree: athlete?.guardian?.relationship_degree ?? '',
      gender: athlete?.guardian.gender ?? 'none',
      cpf: athlete?.guardian.cpf ?? '',
      rg: athlete?.guardian.rg ?? '',
    },
  })

  if (isPageLoading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate-600" />
      </div>
    )
  }

  return (
    <>
      <Helmet title="Atleta" />

      <div className="flex flex-col max-w-[1352px] p-6 pb-10 gap-10 mx-auto">
        <div className="grid items-start gap-y-10 gap-x-6 w-full mt-10 mx-auto mb-11">
          <main className="grid lg:grid-cols-[321px_1fr] items-start lg:gap-8 relative ">
            <aside className="self-start lg:sticky md:top-6">
              <div className="flex flex-col gap-4">
                <div className="flex bg-slate-850 border border-slate-700 rounded flex-col p-0 relative overflow-hidden">
                  <div className="h-40 w-full relative overflow-hidden">
                    <div data-editing="false" className="h-full bg-lime-500">
                      <div className="flex items-center gap-2 absolute top-4 right-4 z-10">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="default"
                              size="xs"
                              className="px-3 "
                            >
                              Editar
                            </Button>
                          </DialogTrigger>

                          <AthleteProfileDialog athlete={athlete} />
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center px-6 -mt-20">
                    <div className="relative">
                      <div className="relative w-full">
                        <span className="flex justify-center items-center text-slate-200 select-none w-[10rem] h-[10rem]">
                          <span className="rounded-full leading-1 text-5xl flex h-full w-full items-center justify-center bg-slate-600 font-medium">
                            {athlete?.initials}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center pt-6 pb-20 w-full">
                      <div className="flex gap-2 items-center justify-center w-full">
                        <strong className="text-xl text-center">
                          {athlete?.name}
                        </strong>
                      </div>

                      <div className="flex flex-col w-full items-center">
                        <span className="text-sm text-slate-400">
                          {athlete?.blood_type
                            ? `O tipo sanguíneo é (${bloodTypeMap[athlete.blood_type!]})`
                            : 'Tipo sanguíneo a definir'}
                        </span>

                        <div className="flex flex-col w-full items-center">
                          <div className="flex gap-2 justify-center mt-2 items-center">
                            {athlete?.gender ? (
                              <span>{genderMap[athlete.gender!]}</span>
                            ) : (
                              ''
                            )}

                            {!athlete?.gender && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="px-3 gap-2"
                                  >
                                    <Plus className="text-lime-400 size-5" />

                                    <span className="shrink-0 text-gray-200">
                                      Gênero
                                    </span>
                                  </Button>
                                </DialogTrigger>

                                <AthleteProfileDialog athlete={athlete} />
                              </Dialog>
                            )}

                            {athlete?.handedness && athlete?.blood_type && (
                              <span> | </span>
                            )}

                            {!athlete?.handedness && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="px-3 gap-2"
                                  >
                                    <Plus className="text-lime-400 size-5" />

                                    <span className="shrink-0 text-gray-200">
                                      Lateralidade
                                    </span>
                                  </Button>
                                </DialogTrigger>

                                <AthleteProfileDialog athlete={athlete} />
                              </Dialog>
                            )}

                            {athlete?.handedness ? (
                              <span>{handednessMap[athlete.handedness]}</span>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full justify-center py-4 border-t border-slate-700 absolute bottom-0 left-0 opacity-100 visible transition-all ease-in-out duration-300">
                    <span className="text-xs text-slate-300">
                      Nascido em {athlete?.birth_date}
                    </span>
                  </div>
                </div>
              </div>
              <br>
              </br>

              <div className="flex border border-slate-700 rounded gap-3 flex-col relative overflow-hidden py-6">
              <strong className="font-semibold px-6">Termos</strong>

              <ul className="flex flex-col px-4 list-disc">
               <li className="group py-2 px-3 cursor-pointer text-slate-300 hover:bg-slate-800 rounded flex items-center justify-between transition-colors">
              <div className="space-x-4 text-md">
           <span>&#8226;</span>
           <span>Termo de responsabilidade</span>
             </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Download className="size-4" />
          </button>
        </DialogTrigger>
        <AthleteProfileTermos athlete={athlete} />
      </Dialog>
    </li>

    <li className="group py-2 px-3 cursor-pointer text-slate-300 hover:bg-slate-800 rounded flex items-center justify-between transition-colors">
      <div className="space-x-4 text-md">
        <span>&#8226;</span>
        <span>Termo de imagem</span>
      </div>
      <Dialog>
      <DialogTrigger asChild>

      <button
        type="button"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Download className="size-4" />
      </button>
      </DialogTrigger>
        <AthleteProfileTermosImagem athlete={athlete} />
      </Dialog>
    </li>
  </ul>
</div>
</aside>

            <div className="flex flex-col gap-4 overflow-hidden">
              <div className="flex bg-slate-800 border border-slate-700 rounded p-6 relative gap-4">
                <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                  <BookHeart className="size-7 text-slate-400" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-xl">Anamnese do atleta</h2>

                    {athlete?.anamnesis && (
                      <Link to={`/anamnesis/${athlete.anamnesis.id}`}>
                        <div className="font-bold	inline-flex justify-center items-center gap-2 flex-shrink-0 text-sm text-lime-500 cursor-pointer">
                          Visualizar Anamnese
                          <ArrowRight className="size-4" />
                        </div>
                      </Link>
                    )}
                  </div>

                  <p className="text-slate-400 text-md">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Illo iusto earum totam necessitatibus voluptate aut, facere
                    accusantium eius, quaerat excepturi, harum sint nesciunt!
                    Explicabo laboriosam eaque error, libero accusamus illo!
                  </p>
                </div>
              </div>

              <div className="flex flex-col bg-slate-800 border border-slate-700 rounded p-6 relative gap-6">
                <div className="flex items-start gap-4">
                  <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                    <ShieldCheck className="size-7 text-slate-400" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-bold text-xl">Responsável</h2>

                    <p className="text-slate-400 text-md">
                      Completar o perfil dos responsáveis aumenta as chances de
                      sucesso dos Atletas
                    </p>
                  </div>
                </div>

                <form
                  action=""
                  onSubmit={handleSubmit((data) =>
                    handleUpdateGuardian(data, athlete?.guardian?.id),
                  )}
                  className="flex flex-col gap-6"
                >
                  <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-y-6 lg:gap-x-6">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="text-sm text-slate-400">
                        Nome
                      </Label>

                      <Input>
                        <Control
                          placeholder="Nome do responsável"
                          type="text-area"
                          className="text-sm"
                          autoComplete="off"
                          {...register('name')}
                        />
                      </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-sm text-slate-400">
                        Email
                      </Label>

                      <Input>
                        <Control
                          placeholder="Email do responsável"
                          type="text-area"
                          className="text-sm"
                          autoComplete="off"
                          {...register('email')}
                        />
                      </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rg" className="text-sm text-slate-400">
                        RG
                      </Label>

                      <Input>
                        <Control
                          placeholder="99.999.999-0"
                          type="text-area"
                          className="text-sm"
                          autoComplete="off"
                          {...register('rg')}
                        />
                      </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cpf" className="text-sm text-slate-400">
                        CPF
                      </Label>

                      <Input>
                        <Control
                          placeholder="999.999.999-99"
                          type="text-area"
                          className="text-sm"
                          autoComplete="off"
                          {...register('cpf')}
                        />
                      </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="relationship_degree"
                        className="text-sm text-slate-400"
                      >
                        Grau de parentesco
                      </Label>

                      <Input>
                        <Control
                          placeholder="Grau de paretesco do responsável"
                          type="text-area"
                          className="text-sm"
                          autoComplete="off"
                          {...register('relationship_degree')}
                        />
                      </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="gender"
                        className="text-sm text-slate-400"
                      >
                        Gênero
                      </Label>

                      <Controller
                        name="gender"
                        control={control}
                        render={({
                          field: { name, onChange, value, disabled },
                        }) => (
                          <Select
                            defaultValue="none"
                            name={name}
                            onValueChange={onChange}
                            value={value}
                            disabled={disabled}
                          >
                            <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="none">
                                Selecione uma opção
                              </SelectItem>

                              <SelectItem value="MALE">Masculino</SelectItem>
                              <SelectItem value="FEMALE">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      ></Controller>
                    </div>
                  </div>

                  <div className="self-end">
                    <Button
                      type="submit"
                      size="sm"
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

                      <span className="text-sm leading-6">Salvar</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
