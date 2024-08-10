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

import { Eye, EyeOff, Loader2Icon, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { z } from 'zod'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { updateEmail } from '@/api/update-email'

import { toast } from 'sonner'

import { AxiosError } from 'axios'

import type { GetProfileResponse } from '@/api/get-profile'

interface UpdateEmailDialogProps {
  email: string | undefined
}

const updateEmailSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

type UpdateEmailSchema = z.infer<typeof updateEmailSchema>

export function UpdateEmailDialog({ email }: UpdateEmailDialogProps) {
  const [isShowingPassword, setIsShowingPassword] = useState(false)

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateEmailSchema>({
    resolver: zodResolver(updateEmailSchema),
    values: {
      email: '',
      currentPassword: '',
    },
  })

  function updateUserEmailCache({ email, currentPassword }: UpdateEmailSchema) {
    const cached = queryClient.getQueryData<GetProfileResponse>(['profile'])

    if (cached) {
      queryClient.setQueryData<GetProfileResponse>(['profile'], {
        ...cached,

        email,
        currentPassword,
      })
    }

    return {
      cached,
    }
  }

  const { mutateAsync: updateUserEmailFn } = useMutation({
    mutationFn: updateEmail,

    onMutate({ email, currentPassword }) {
      const { cached } = updateUserEmailCache({ email, currentPassword })

      return {
        previousProfile: cached,
      }
    },

    onError(_, __, context) {
      if (context?.previousProfile) {
        updateUserEmailCache(context.previousProfile)
      }
    },
  })

  async function handleUpdateUserEmail(data: UpdateEmailSchema) {
    try {
      await updateUserEmailFn({
        email: data.email,
        currentPassword: data.currentPassword,
      })

      toast.success('E-mail atualizado com sucesso!')
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
        <DialogTitle>Alteraração de e-mail</DialogTitle>

        <DialogDescription>
          Por motivos de segurança, nossa equipe pede a sua senha para confirmar
          a alteração.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <Mail className="size-4 text-lime-300" />

          <span className="text-slate-300">{email}</span>
        </div>

        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleUpdateUserEmail)}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm text-slate-400">
              Novo e-mail
            </Label>

            <Input>
              <Control
                placeholder="Para qual e-mail você gostaria de alterar?"
                type="email"
                className="text-sm"
                autoComplete="off"
                {...register('email')}
              />
            </Input>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm text-slate-400">
              Senha
            </Label>

            <Input>
              <Control
                type={isShowingPassword ? 'text' : 'password'}
                className="text-sm"
                autoComplete="off"
                placeholder="Digite sua senha para confirmar"
                {...register('currentPassword')}
              />

              <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                <button type="button">
                  {isShowingPassword ? (
                    <EyeOff
                      className="size-5"
                      strokeWidth={1.75}
                      onClick={() => setIsShowingPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="size-5"
                      strokeWidth={1.75}
                      onClick={() => setIsShowingPassword(true)}
                    />
                  )}
                </button>
              </span>
            </Input>
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
