import { useState } from 'react'

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'

import { Input, Control } from '@/components/ui/input'

import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useMutation } from '@tanstack/react-query'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'

import { z } from 'zod'

import { updatePassword } from '@/api/update-password'

import { AxiosError } from 'axios'

import { Separator } from '@/components/ui/separator'

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    newPassword: z
      .string()
      .min(6, 'A nova senha deve ter ao menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'Confirmação de senha deve ter ao menos 6 caracteres'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não correspondem',
    path: ['confirmPassword'],
  })

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>

export function UpdatePasswordDialog() {
  const [isShowingCurrentPassword, setIsShowingCurrentPassword] =
    useState(false)
  const [isShowingNewPassword, setIsShowingNewPassword] = useState(false)
  const [isShowingConfirmPassword, setIsShowingConfirmPassword] =
    useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),

    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { mutateAsync: updateUserPasswordFn } = useMutation({
    mutationFn: updatePassword,
  })

  async function handleUpdateUserPassword(data: UpdatePasswordSchema) {
    try {
      await updateUserPasswordFn({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
      })

      toast.success('Senha atualizada com sucesso!')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('Aconteceu um erro inesperado.')
        }
      } else {
        toast.error('Erro ao atualizar e-mail, tente novamente!')
      }
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Alteração de senha</DialogTitle>

        <DialogDescription>
          Informe sua senha atual e a nova senha abaixo:
        </DialogDescription>
      </DialogHeader>

      <form
        action=""
        onSubmit={handleSubmit(handleUpdateUserPassword)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword" className="text-sm text-slate-400">
            Senha atual
          </Label>

          <Input>
            <Control
              type={isShowingCurrentPassword ? 'text' : 'password'}
              className="text-sm"
              autoComplete="off"
              placeholder="Digite sua senha atual"
              {...register('currentPassword')}
            />

            <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
              <button type="button">
                {isShowingCurrentPassword ? (
                  <EyeOff
                    className="size-5"
                    strokeWidth={1.75}
                    onClick={() => setIsShowingCurrentPassword(false)}
                  />
                ) : (
                  <Eye
                    className="size-5"
                    strokeWidth={1.75}
                    onClick={() => setIsShowingCurrentPassword(true)}
                  />
                )}
              </button>
            </span>
          </Input>

          {errors.currentPassword && (
            <span className="text-sm font-medium text-red-500">
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <Separator className="bg-slate-400 my-3" />

        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword" className="text-sm text-slate-400">
            Nova senha
          </Label>

          <Input>
            <Control
              type={isShowingNewPassword ? 'text' : 'password'}
              className="text-sm"
              autoComplete="off"
              placeholder="Digite sua nova senha"
              {...register('newPassword')}
            />

            <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
              <button type="button">
                {isShowingNewPassword ? (
                  <EyeOff
                    className="size-5"
                    strokeWidth={1.75}
                    onClick={() => setIsShowingNewPassword(false)}
                  />
                ) : (
                  <Eye
                    className="size-5"
                    strokeWidth={1.75}
                    onClick={() => setIsShowingNewPassword(true)}
                  />
                )}
              </button>
            </span>
          </Input>

          {errors.newPassword && (
            <span className="text-sm font-medium text-red-500">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword" className="text-sm text-slate-400">
            Confirmar nova senha
          </Label>

          <Input>
            <Control
              type={isShowingConfirmPassword ? 'text' : 'password'}
              className="text-sm"
              autoComplete="off"
              placeholder="Confirme sua nova senha"
              {...register('confirmPassword')}
            />

            <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
              <button type="button">
                {isShowingConfirmPassword ? (
                  <EyeOff
                    className="size-5"
                    strokeWidth={1.75}
                    onClick={() => setIsShowingConfirmPassword(false)}
                  />
                ) : (
                  <Eye
                    className="size-5"
                    strokeWidth={1.75}
                    onClick={() => setIsShowingConfirmPassword(true)}
                  />
                )}
              </button>
            </span>
          </Input>

          {errors.confirmPassword && (
            <span className="text-sm font-medium text-red-500">
              {errors.confirmPassword.message}
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
            disabled={isSubmitting}
          >
            Confirmar alteração
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
