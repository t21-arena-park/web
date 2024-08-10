import { Button } from '@/components/ui/button'

import { Controller, useForm } from 'react-hook-form'

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input, Control } from '@/components/ui/input'

import { Loader2Icon } from 'lucide-react'

import { Label } from '@/components/ui/label'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { AxiosError } from 'axios'

import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAthlete } from '@/api/update-athlete'

interface Athlete {
  id: string
  name: string
  birth_date: string
  blood_type:
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE'
  gender: 'MALE' | 'FEMALE'
  handedness: 'RIGHT' | 'LEFT'
}

interface AthleteProfileDialogProps {
  athlete: Athlete | undefined
}

const athleteProfileBodySchema = z.object({
  name: z.string(),
  birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Formato da data inválido',
  }),
  handedness: z.enum(['RIGHT', 'LEFT', 'none']),
  gender: z.enum(['MALE', 'FEMALE', 'none']),
  blood_type: z.enum([
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
})

type AthleteProfileFormSchema = z.infer<typeof athleteProfileBodySchema>

export function AthleteProfileDialog({ athlete }: AthleteProfileDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AthleteProfileFormSchema>({
    resolver: zodResolver(athleteProfileBodySchema),

    values: {
      name: athlete?.name ?? '',
      gender: athlete?.gender ?? 'none',
      birth_date: athlete?.birth_date
        ? new Date(athlete.birth_date).toISOString().split('T')[0]
        : '',
      blood_type: athlete?.blood_type ?? 'none',
      handedness: athlete?.handedness ?? 'none',
    },
  })

  const { mutateAsync: updateAthleteFn } = useMutation({
    mutationFn: updateAthlete,
  })

  const queryClient = useQueryClient()

  async function handleUpdateAthlete(
    data: AthleteProfileFormSchema,
    athleteId: string | undefined,
  ) {
    try {
      await updateAthleteFn({ ...data, id: athleteId! })

      queryClient.invalidateQueries({
        queryKey: ['athlete-profile', athleteId],
      })

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

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edição de atleta</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) =>
            handleUpdateAthlete(data, athlete?.id),
          )}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm text-slate-400">
              Nome
            </Label>

            <Input>
              <Control
                placeholder="Nome do Atleta"
                type="text"
                className="text-sm"
                autoComplete="off"
                {...register('name')}
              />
            </Input>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="birth_date" className="inline-block text-slate-400">
              Data de nascimento
            </Label>

            <Input variant="default">
              <Control
                type="date"
                placeholder="99/99/9999"
                {...register('birth_date')}
              />
            </Input>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="handedness" className="text-sm text-slate-400">
              Lateralidade
            </Label>

            <Controller
              name="handedness"
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  disabled={disabled}
                  {...register('handedness')}
                >
                  <SelectTrigger className="h-12 w-full bg-slate-900 text-base">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Selecione uma opção</SelectItem>

                    <SelectItem value="RIGHT">Destro</SelectItem>

                    <SelectItem value="LEFT">Canhoto</SelectItem>
                  </SelectContent>
                </Select>
              )}
            ></Controller>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="gender" className="text-sm text-slate-400">
              Genêro
            </Label>

            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  disabled={disabled}
                  {...register('gender')}
                >
                  <SelectTrigger className="h-12 w-full bg-slate-900 text-base">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Selecione uma opção</SelectItem>

                    <SelectItem value="MALE">Masculino</SelectItem>

                    <SelectItem value="FEMALE">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              )}
            ></Controller>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="blood_type" className="text-sm text-slate-400">
              Tipo sanguíneo
            </Label>

            <Controller
              name="blood_type"
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  disabled={disabled}
                  {...register('blood_type')}
                >
                  <SelectTrigger className="h-12 w-full  bg-slate-900 text-base">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Selecione uma opção</SelectItem>

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
