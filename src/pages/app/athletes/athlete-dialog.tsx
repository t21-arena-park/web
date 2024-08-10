import { createAthlete } from '@/api/create-athlete'

import { Button } from '@/components/ui/button'

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

import { Input, Control } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AxiosError } from 'axios'

import { Loader2Icon } from 'lucide-react'

import { Controller, useForm } from 'react-hook-form'

import { z } from 'zod'

import { toast } from 'sonner'

const createAthleteBodySchema = z.object({
  name: z.string(),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Formato da data inválido',
  }),
  handedness: z.enum(['RIGHT', 'LEFT', 'none']),
  gender: z.enum(['MALE', 'FEMALE', 'none']),
  bloodType: z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
    'none',
  ]),
  status: z.boolean().default(true),
  guardianName: z.string(),
})

type CreateAthleteBodySchema = z.infer<typeof createAthleteBodySchema>

export function AthleteDialog() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateAthleteBodySchema>({
    resolver: zodResolver(createAthleteBodySchema),

    values: {
      name: '',
      birthDate: '',
      handedness: 'none',
      gender: 'none',
      bloodType: 'none',
      status: true,
      guardianName: '',
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: createAthleteFn } = useMutation({
    mutationFn: createAthlete,
  })

  async function handleCreateAthlete(data: CreateAthleteBodySchema) {
    try {
      await createAthleteFn(data)

      queryClient.invalidateQueries({
        queryKey: ['athletes'],
      })

      reset()

      toast.success('Atleta cadastrado com sucesso!')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('Aconteceu um erro inesperado.')
        }
      } else {
        toast.error('Erro ao criar atleta, tente novamente!')
      }
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastro do atleta</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className="flex flex-col">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleCreateAthlete)}
        >
          <div className="flex flex-col gap-4 p-[2px] max-h-80 overflow-y-auto lg:max-h-96 xl:max-h-fit">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm text-slate-400">
                Nome
              </Label>

              <Input>
                <Control
                  placeholder="Nome do atleta"
                  type="text"
                  className="text-sm"
                  autoComplete="off"
                  {...register('name')}
                />
              </Input>

              {errors.name && (
                <span className="text-sm font-medium text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="birthDate" className="text-sm text-slate-400">
                Data de nascimento
              </Label>

              <Input>
                <Control
                  type="date"
                  className="text-sm"
                  autoComplete="off"
                  {...register('birthDate')}
                />
              </Input>

              {errors.birthDate && (
                <span className="text-sm font-medium text-red-500">
                  {errors.birthDate.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="handedness" className="text-sm text-slate-400">
                Lateralidade
              </Label>

              <Controller
                name="handedness"
                control={control}
                render={({ field: { onChange, name, value, disabled } }) => (
                  <Select
                    defaultValue="none"
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                    name={name}
                  >
                    <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none" disabled>
                        Selecione uma opção
                      </SelectItem>

                      <SelectItem value="RIGHT">Destro</SelectItem>
                      <SelectItem value="LEFT">Canhoto</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              ></Controller>

              {errors.handedness && (
                <span className="text-sm font-medium text-red-500">
                  {errors.handedness.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="gender" className="text-sm text-slate-400">
                Gênero
              </Label>

              <Controller
                name="gender"
                control={control}
                render={({ field: { onChange, name, value, disabled } }) => (
                  <Select
                    defaultValue="none"
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                    name={name}
                  >
                    <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none" disabled>
                        Selecione uma opção
                      </SelectItem>

                      <SelectItem value="MALE">Masculino</SelectItem>
                      <SelectItem value="FEMALE">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              ></Controller>

              {errors.gender && (
                <span className="text-sm font-medium text-red-500">
                  {errors.gender.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bloodType" className="text-sm text-slate-400">
                Tipo sanguíneo
              </Label>

              <Controller
                name="bloodType"
                control={control}
                render={({ field: { onChange, name, value, disabled } }) => (
                  <Select
                    defaultValue="none"
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                    name={name}
                  >
                    <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none" disabled>
                        Selecione uma opção
                      </SelectItem>

                      <SelectItem value="A_POSITIVE">A+</SelectItem>
                      <SelectItem value="A_NEGATIVE">A-</SelectItem>
                      <SelectItem value="B_POSITIVE">B+</SelectItem>
                      <SelectItem value="B_NEGATIVE">B-</SelectItem>
                      <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                      <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                      <SelectItem value="O_POSITIVE">O+</SelectItem>
                      <SelectItem value="O_NEGATIVE">O-</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              ></Controller>

              {errors.bloodType && (
                <span className="text-sm font-medium text-red-500">
                  {errors.bloodType.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="guardianName" className="text-sm text-slate-400">
                Nome do responsável
              </Label>

              <Input>
                <Control
                  placeholder="Nome do responsável"
                  type="text"
                  className="text-sm"
                  autoComplete="off"
                  {...register('guardianName')}
                />
              </Input>

              {errors.guardianName && (
                <span className="text-sm font-medium text-red-500">
                  {errors.guardianName.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                className="rounded-md"
                size="sm"
              >
                Fechar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="primary"
              className="rounded-md"
              size="sm"
            >
              {isSubmitting && (
                <Loader2Icon strokeWidth={3} className="animate-spin size-4" />
              )}
              <span>Cadastrar</span>
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  )
}
