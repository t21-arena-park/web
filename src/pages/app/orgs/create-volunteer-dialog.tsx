import { Button } from '@/components/ui/button'

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { Input, Control } from '@/components/ui/input'

import { Loader2Icon } from 'lucide-react'

import { Label } from '@/components/ui/label'

import { Controller, useForm } from 'react-hook-form'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { z } from 'zod'

import { createVolunteer } from '@/api/create-volunteer'

import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'

import { AxiosError } from 'axios'

const createVolunteerSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  area: z.enum([
    'UNSPECIFIED',
    'PSYCHOLOGY',
    'PHYSIOTHERAPY',
    'NUTRITION',
    'NURSING',
    'PSYCHOPEDAGOGY',
    'PHYSICAL_EDUCATION',
  ]),

  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
  phone: z.string().optional(),
})

type CreateVolunteerSchema = z.infer<typeof createVolunteerSchema>

export function CreateVolunteerDialog() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateVolunteerSchema>({
    resolver: zodResolver(createVolunteerSchema),

    values: {
      name: '',
      email: '',
      password: 'T21-ARENA-PARK',
      phone: '',
      area: 'UNSPECIFIED',
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: createVolunteerFn } = useMutation({
    mutationFn: createVolunteer,
  })

  async function handleCreateVolunteer(data: CreateVolunteerSchema) {
    try {
      await createVolunteerFn({
        name: data.name,
        area: data.area,
        phone: data.phone,
        email: data.email,
        password: 'T21-ARENA-PARK',
        role: 'VOLUNTEER',
      })

      queryClient.invalidateQueries({
        queryKey: ['volunteers'],
      })

      reset()

      toast.success('Voluntário criado com sucesso!')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('Aconteceu um erro inesperado.')
        }
      } else {
        toast.error('Erro ao criar voluntário, tente novamente!')
      }
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastro de voluntário</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className="flex flex-col">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleCreateVolunteer)}
        >
          <div className="flex flex-col gap-4 p-[2px] max-h-80 overflow-y-auto lg:max-h-96 xl:max-h-fit">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm text-slate-400">
                Nome
              </Label>

              <Input>
                <Control
                  placeholder="Nome do voluntário"
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
              <Label htmlFor="email" className="text-sm text-slate-400">
                E-mail
              </Label>

              <Input>
                <Control
                  placeholder="E-mail do voluntário"
                  type="email"
                  className="text-sm"
                  autoComplete="off"
                  {...register('email')}
                />
              </Input>

              {errors.email && (
                <span className="text-sm font-medium text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-sm text-slate-400">
                Telefone (opcional)
              </Label>

              <Input>
                <Control
                  placeholder="(99) 99999-9999"
                  type="phone"
                  className="text-sm"
                  autoComplete="off"
                  {...register('phone')}
                />
              </Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="area" className="text-sm text-slate-400">
                Área
              </Label>

              <Controller
                name="area"
                control={control}
                render={({ field: { onChange, name, value, disabled } }) => (
                  <Select
                    defaultValue="UNSPECIFIED"
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

                      <SelectItem value="UNSPECIFIED">
                        Não especificado
                      </SelectItem>
                      <SelectItem value="PSYCHOLOGY">Psicologia</SelectItem>
                      <SelectItem value="PHYSIOTHERAPY">
                        Fisioterapia
                      </SelectItem>
                      <SelectItem value="NUTRITION">Nutrição</SelectItem>
                      <SelectItem value="NURSING">Enfermagem</SelectItem>
                      <SelectItem value="PSYCHOPEDAGOGY">
                        Psicopedagogia
                      </SelectItem>
                      <SelectItem value="PHYSICAL_EDUCATION">
                        Educação Física
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              ></Controller>

              {errors.area && (
                <span className="text-sm font-medium text-red-500">
                  {errors.area.message}
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
