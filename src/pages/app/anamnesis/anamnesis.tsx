import * as Tabs from '@radix-ui/react-tabs'

import { getAnamnesis } from '@/api/get-anamnesis'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useParams } from 'react-router-dom'

import { Helmet } from 'react-helmet-async'

import { BrainCircuit, ChevronRight, ListTodo, Loader2, Loader2Icon, Pill } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import {
  updateAnswer,
  UpdateAnswerParams,
  UpdateAnswerBody,
} from '@/api/update-anamnesis-answer'

const ICON_MAP: Record<string, JSX.Element> = {
  LIST_TODO: <ListTodo className="size-5" />,
  BRAIN_CIRCUIT: <BrainCircuit className="size-5" />,
  PILL: <Pill className="size-5" />
}

type FormData = {
  [key: string]: {
    id: number
    answer: string
  }
}

export function Anamnesis() {
  const params = useParams<{ id: string }>()
  const id = params.id ?? ''
  const queryClient = useQueryClient()

  const { data: anamnesis, isLoading: isPageLoading } = useQuery({
    queryKey: ['anamnesis', id],
    queryFn: () => getAnamnesis({ id }),
    enabled: id !== '',
  })

  const defaultValues: FormData = anamnesis
    ? anamnesis.sections.reduce((acc, section) => {
      section.questions.forEach((question) => {
        acc[`${section.id}_${question.id}`] = {
          id: question.id,
          answer: question.answers.value || '',
        }
      })
      return acc
    }, {} as FormData)
    : {}

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<FormData>({ defaultValues })

  const { mutateAsync: updateAnswerFn } = useMutation({
    mutationFn: (data: {
      params: UpdateAnswerParams
      body: UpdateAnswerBody
    }) => updateAnswer(data.params, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anamnesis', id] })
    },
    onError: () => {
      toast.error('Aconteceu um erro inesperado.')
    },
  })

  async function handleSectionSubmit(data: FormData) {
    try {
      if (anamnesis) {
        for (const section of anamnesis.sections) {
          for (const question of section.questions) {
            const uniqueKey = `${section.id}_${question.id}`
            const newAnswer = data[uniqueKey]?.answer || ''

            if (newAnswer !== question.answers.value) {
              await updateAnswerFn({
                params: {
                  id,
                  sectionId: section.id,
                  questionId: question.id,
                },
                body: {
                  value: newAnswer,
                },
              })
            }
          }
        }

        toast.success('Dados da anamnese do usuário atualizados com sucesso!')
      }
    } catch (error) {
      toast.error('Aconteceu um erro ao atualizar as respostas.')
    }
  }

  if (isPageLoading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate-600" />
      </div>
    )
  }

  return (
    <>
      <Helmet title="Anamnese" />
      <div className="flex flex-col max-w-[1352px] p-6 pb-10 gap-10 mx-auto">
        <div className="grid items-start gap-y-10 gap-x-6 w-full mt-10 mx-auto mb-11">
          <div className="col-span-full flex flex-col gap-1">
            <h1 className="font-bold font-error text-2xl">
              Anamnese do (a) {anamnesis?.athlete.name}
            </h1>
            <p className="text-sm text-slate-400">
              Gerencie as informações da anamnese do atleta.
            </p>
          </div>

          {anamnesis && (
            <Tabs.Root
              defaultValue={`tab-${anamnesis.sections[0].id}`}
              className="grid lg:grid-cols-[321px_1fr] items-start lg:gap-8"
            >
              <Tabs.List
                asChild
                className="flex rounded-md px-0 border border-slate-700 col-span-full lg:col-span-1 lg:flex-col lg:py-4 grid-auto-flow p-0 overflow-hidden border-b border-b-slate-700"
              >
                <aside className="flex lg:flex-col">
                  {anamnesis.sections.map((section) => (
                    <Tabs.Trigger
                      key={section.id}
                      value={`tab-${section.id}`}
                      className="flex items-center py-4 px-0 justify-center flex-1 lg:justify-start lg:py-[.875rem] lg:px-6 transition-colors text-slate-400 font-normal data-[state=active]:font-semibold data-[state=active]:text-slate-200 data-[state=active]:bg-slate-800 [&[data-state=active]>svg]:text-lime-500 data-[state=active]:border-b-2 data-[state=active]:border-b-lime-500 lg:data-[state=active]:border-b-0 lg:data-[state=active]:border-l-2 lg:data-[state=active]:border-l-lime-500"
                    >
                      {ICON_MAP[section.icon] || (
                        <ListTodo className="size-5" />
                      )}
                      <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                        {section.title}
                      </span>
                      <ChevronRight className="size-4 hidden lg:inline" />
                    </Tabs.Trigger>
                  ))}
                </aside>
              </Tabs.List>

              <main className="mt-10 lg:mt-0">
                {anamnesis.sections.map((section) => (
                  <Tabs.Content key={section.id} value={`tab-${section.id}`}>
                    <div className="flex items-center gap-3 mb-8">
                      {ICON_MAP[section.icon] || (
                        <ListTodo className="size-5" />
                      )}
                      <h2 className="text-xl">{section.title}</h2>
                    </div>

                    <form
                      className="w-full flex flex-col gap-4"
                      onSubmit={handleSubmit(handleSectionSubmit)}
                    >
                      <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md space-y-6">
                        {section.questions.map((question) => {
                          const uniqueKey = `${section.id}_${question.id}`

                          return (
                            <div className="flex flex-col" key={question.id}>
                              <input
                                type="hidden"
                                {...register(`${uniqueKey}.id`)}
                                value={question.id}
                              />
                              <section className="w-full flex flex-col gap-3">
                                <Label
                                  htmlFor={`${uniqueKey}.answer`}
                                  className="inline-block text-md text-slate-400"
                                >
                                  {question.title}
                                </Label>

                                {question.question_type === 'MULTIPLE_CHOICE' ? (
                                  <section className="flex flex-col">
                                    {question.answers?.value.split(',').map((option, index) => (
                                      <label key={index} className="flex items-center gap-2 mb-1">
                                        <input
                                          type="radio"
                                          value={option.trim()}
                                          {...register(question.id.toString())}
                                          className="size-4 hidden peer"
                                        />
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:bg-[#84CC16]"></div>
                                        <span className="inline-block text-md text-slate-400">{option.trim()}</span>
                                      </label>
                                    ))}
                                  </section>
                                ) :
                                  question.question_type === 'MULTI_SELECT' ? (
                                    <section className="flex flex-col">
                                      {question.answers?.value.split(',').map((option, index) => (
                                        <label key={index} className="flex items-center gap-2 mb-1">
                                          <input
                                            type="checkbox"
                                            value={option.trim()}
                                            className="hidden peer"
                                            {...register(`${uniqueKey}.answers`)}
                                          />
                                          <div className="w-5 h-5 rounded-xl border-2 border-gray-300 peer-checked:bg-[#84CC16] flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded hidden peer-checked:block"></div>
                                          </div>
                                          <span className="inline-block text-md text-slate-400">{option.trim()}</span>
                                        </label>
                                      ))}
                                    </section>
                                  ) :
                                    question.question_type === 'ESSAY' ? (
                                      <textarea
                                        id={`${uniqueKey}.answer`}
                                        className="min-h-36 bg-[#0F172A] rounded-md"
                                        defaultValue={question.answers.value || ''}
                                        {...register(`${uniqueKey}.answer`)}
                                      />
                                    ) : null}
                              </section>
                            </div>
                          )
                        })}
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
                ))}
              </main>
            </Tabs.Root>
          )}
        </div>
      </div>
    </>
  )
}
