import { useState } from 'react'

import { Control, Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { ChevronRight, Eye, EyeOff, Loader2Icon, Send } from 'lucide-react'

import { Label } from '@/components/ui/label'

import { Separator } from '@/components/ui/separator'

import { z } from 'zod'

import { toast } from 'sonner'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { Helmet } from 'react-helmet-async'

import { useMutation } from '@tanstack/react-query'

import { signIn } from '@/api/sign-in'

import { AxiosError } from 'axios'

import { useNavigate } from 'react-router-dom'

const signInFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const [isShowingPassword, setIsShowingPassword] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInForm) {
    try {
      await authenticate({
        email: data.email,
        password: data.password,
      })

      navigate('/')
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
    <>
      <Helmet title="Login" />

      <div className="h-[100dvh] overflow-auto p-20 max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7">
        <div className="mb-12 mt-16 flex flex-col gap-3 max-md:mb-8 max-md:mt-12">
          <h1 className="text-2xl font-bold">Acesse sua conta</h1>

          <p className="text-slate-300">
            Eleve seu jogo, acesse a plataforma e conheça o futuro dos seus
            atletas.
          </p>
        </div>

        <form
          action=""
          method="post"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div className="flex flex-col gap-2 [&>label]:text-sm">
            <Label htmlFor="email">E-mail</Label>

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

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 [&>label]:text-sm">
              <Label htmlFor="password">Senha</Label>

              <Input>
                <Control
                  type={isShowingPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  {...register('password')}
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

              {errors.password && (
                <span className="text-sm font-medium text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <a
              href="/forgot"
              className="text-sm w-fit font-medium text-lime-400 transition hover:brightness-125"
            >
              Esqueci minha senha
            </a>
          </div>

          <Button type="submit" variant="primary">
            <div className="flex flex-1 items-center justify-center gap-2">
              {isSubmitting ? (
                <Loader2Icon strokeWidth={3} className="animate-spin size-6" />
              ) : (
                <span className="text-base leading-6">Entrar</span>
              )}
            </div>
          </Button>
        </form>

        <Separator
          className="my-14 bg-slate-600 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full"
          decorative
          orientation="horizontal"
        />

        <a
          href="https://forms.gle/ZLK6CfJvRmofcMbR8"
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex w-full gap-4 rounded-md border border-slate-600 bg-slate-700 px-6 py-4 transition hover:brightness-125">
            <Send className="mt-2 size-6 text-lime-400" />

            <div className="flex flex-col text-slate-200">
              Não tem uma conta?
              <span className="font-medium text-lime-400">
                Entre em contato com a gente
              </span>
            </div>

            <ChevronRight className="ml-auto size-6 self-center text-slate-400" />
          </div>
        </a>
      </div>
    </>
  )
}
