import { useState } from 'react'

import { Label } from '@/components/ui/label'

import { z } from 'zod'

import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { Helmet } from 'react-helmet-async'

import { zodResolver } from '@hookform/resolvers/zod'

import { ArrowLeft, Eye, EyeOff, Loader2Icon } from 'lucide-react'

import { useMutation } from '@tanstack/react-query'

import { forgotPassword } from '@/api/forgot-password'

import { AxiosError } from 'axios'

import { useNavigate } from 'react-router-dom'

import { Input, Control } from '@/components/ui/input'

const forgotPasswordFormScheme = z.object({
  email: z.string().email('E-mail inválido'),
  newPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordFormScheme>

export function Forgot() {
  const [isShowingPassword, setIsShowingPassword] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordFormScheme),
  })

  const { mutateAsync: forgot } = useMutation({
    mutationFn: forgotPassword,
  })

  async function handleForgotPassword(data: ForgotPasswordForm) {
    try {
      await forgot({
        email: data.email,
        newPassword: data.newPassword,
      })

      toast.success('Sua senha foi atualizada com sucesso.', {
        onAutoClose: () => navigate('/sign-in?change-password=true'),
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    }
  }

  return (
    <>
      <Helmet title="Recuperar senha" />

      <div className="h-[100dvh] overflow-auto p-20 max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7">
        <div className="mb-12 mt-16 flex flex-col gap-3 max-md:mb-8 max-md:mt-12">
          <h1 className="text-2xl font-bold dark:text-slate-200">
            Esqueci minha senha
          </h1>

          <p className="text-sm dark:text-slate-300">
            Não se preocupe, envie seu e-mail e nós cuidaremos de reconectar
            você ao jogo.
          </p>
        </div>

        <form
          action=""
          method="post"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleForgotPassword)}
        >
          <div className="flex flex-col gap-2 [&>label]:text-sm dark:[&>label]:text-slate-200">
            <Label htmlFor="">E-mail</Label>

            <Input>
              <Control
                placeholder="Seu e-mail"
                type="email"
                {...register('email')}
              />
            </Input>

            {errors.email && (
              <span className="text-sm font-medium text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 [&>label]:text-sm dark:[&>label]:text-slate-200">
            <Label htmlFor="">Senha</Label>

            <Input>
              <Control
                type={isShowingPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                {...register('newPassword')}
              />

              <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                <button type="button">
                  {isShowingPassword ? (
                    <EyeOff
                      strokeWidth={1.75}
                      onClick={() => setIsShowingPassword(false)}
                    />
                  ) : (
                    <Eye
                      strokeWidth={1.75}
                      onClick={() => setIsShowingPassword(true)}
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

          <button
            type="submit"
            className="relative inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded border-none dark:bg-lime-600 px-8 py-3 text-2xl font-bold dark:text-slate-100 transition-colors duration-200 ease-in-out dark:hover:enabled:bg-lime-700 disabled:cursor-not-allowed disabled:select-none disabled:opacity-70"
            disabled={isSubmitting}
          >
            <div className="flex flex-1 items-center justify-center gap-2">
              {isSubmitting ? (
                <Loader2Icon strokeWidth={3} className="animate-spin size-6" />
              ) : (
                <span className="text-base leading-6">
                  Recuperar minha senha
                </span>
              )}
            </div>
          </button>

          <a
            href="/sign-in"
            className="flex items-center justify-center w-full gap-2 text-gray-100 font-medium group"
          >
            <ArrowLeft className="group-hover:-translate-x-2 transition size-6" />
            Voltar para o login
          </a>
        </form>
      </div>
    </>
  )
}
