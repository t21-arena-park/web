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

import { updateVolunteer } from '@/api/update-volunteer'

import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'

import { AxiosError } from 'axios'

interface UpdateVolunteerDialogProps {
  volunteerId: string
  volunteerName: string
  volunteerArea:
    | 'UNSPECIFIED'
    | 'PSYCHOLOGY'
    | 'PHYSIOTHERAPY'
    | 'NUTRITION'
    | 'NURSING'
    | 'PSYCHOPEDAGOGY'
    | 'PHYSICAL_EDUCATION'
}

const updateVolunteerSchema = z.object({
  volunteerName: z
    .string()
    .min(3, 'O nome do usuário precisa ter no mínimo 3 caracteres'),
  volunteerArea: z.enum([
    'UNSPECIFIED',
    'PSYCHOLOGY',
    'PHYSIOTHERAPY',
    'NUTRITION',
    'NURSING',
    'PSYCHOPEDAGOGY',
    'PHYSICAL_EDUCATION',
  ]),
})

type UpdateVolunteerSchema = z.infer<typeof updateVolunteerSchema>

export function UpdateVolunteerDialog({
  volunteerId,
  volunteerName,
  volunteerArea,
}: UpdateVolunteerDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<UpdateVolunteerSchema>({
    resolver: zodResolver(updateVolunteerSchema),
    values: {
      volunteerName,
      volunteerArea,
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: updateVolunteerFn } = useMutation({
    mutationFn: updateVolunteer,
  })

  async function handleUpdateVolunteer(data: UpdateVolunteerSchema) {
    try {
      await updateVolunteerFn({
        id: volunteerId,
        name: data.volunteerName,
        area: data.volunteerArea,
      })

      queryClient.invalidateQueries({
        queryKey: ['volunteers'],
      })

      toast.success('Voluntário atualizado com sucesso!')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('Aconteceu um erro inesperado.')
        }
      } else {
        toast.error('Erro ao atualizar voluntário, tente novamente!')
      }
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edição de voluntário</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className="flex flex-col">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleUpdateVolunteer)}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm text-slate-400">
              Nome
            </Label>

            <Input>
              <Control
                placeholder="Para qual e-mail você gostaria de alterar?"
                type="text"
                className="text-sm"
                autoComplete="off"
                {...register('volunteerName')}
              />
            </Input>

            {errors.volunteerName && (
              <span className="text-sm font-medium text-red-500">
                {errors.volunteerName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm text-slate-400">
              Área
            </Label>

            <Controller
              name="volunteerArea"
              control={control}
              render={({ field: { onChange, name, value, disabled } }) => (
                <Select
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
                    <SelectItem value="PHYSIOTHERAPY">Fisioterapia</SelectItem>
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

            {errors.volunteerArea && (
              <span className="text-sm font-medium text-red-500">
                {errors.volunteerArea.message}
              </span>
            )}
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
              <span>Confirmar alteração</span>
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  )
}
