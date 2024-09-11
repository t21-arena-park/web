/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ZodSchema, ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import * as Tabs from '@radix-ui/react-tabs'
import { ListTodo, Loader2Icon } from 'lucide-react'

import {
  updateAnswer,
  UpdateAnswerParams,
  UpdateAnswerBody,
} from '@/api/update-anamnesis-answer'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { Select } from '@/components/ui/select'

interface Question {
  id: number
  title: string
  description: string | null
  observation: string | null
  question_type:
    | 'ESSAY'
    | 'MULTIPLE_CHOICE'
    | 'TRUE_FALSE'
    | 'SHORT_ANSWER'
    | 'RATING'
    | 'DATE'
    | 'TIME'
    | 'NUMBER'
    | 'MULTI_SELECT'
    | 'DROPDOWN'
  answers: {
    value: string
  } | null
}

interface Section {
  id: number
  icon: string
  description: string
  title: string
  questions: Question[]
}

interface Athlete {
  name: string
}

interface Form {
  id: string
  createdAt: string
  sections: Section[]
  athlete: Athlete
}

const ICON_MAP: Record<string, JSX.Element> = {
  LIST_TODO: <ListTodo className="size-5" />,
}

const DynamicForm: React.FC<{ form: Form }> = ({ form }) => {
  const generateZodSchema = (questions: Question[]): ZodSchema<any> => {
    const schema: { [key: string]: ZodType<any> } = {}

    questions.forEach((question) => {
      switch (question.question_type) {
        case 'ESSAY':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'MULTIPLE_CHOICE':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'TRUE_FALSE':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'SHORT_ANSWER':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'RATING':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'DATE':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'TIME':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'NUMBER':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'MULTI_SELECT':
          schema[question.id.toString()] = z.string().optional()
          break
        case 'DROPDOWN':
          schema[question.id.toString()] = z.string().optional()
          break

        default:
          break
      }
    })

    return z.object(schema)
  }

  const renderQuestion = (question: Question, register: any, control: any) => {
    switch (question.question_type) {
      case 'ESSAY':
        return (
          <Textarea
            id={`question-${question.id}`}
            className="min-h-36"
            {...register(question.id.toString())}
            // placeholder={question.title}
          />
        )
      case 'MULTIPLE_CHOICE':
        return (
          <Controller
            name={question.id.toString()}
            control={control}
            render={({ field }) => (
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="opcao1"
                    checked={field.value?.includes('opcao1') || false}
                    onChange={(e) => {
                      const selectedOptions = field.value || []
                      if (e.target.checked) {
                        field.onChange([...selectedOptions, e.target.value])
                      } else {
                        field.onChange(
                          selectedOptions.filter(
                            (option: string) => option !== e.target.value,
                          ),
                        )
                      }
                    }}
                  />
                  Opção 1
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="opcao2"
                    checked={field.value?.includes('opcao2') || false}
                    onChange={(e) => {
                      const selectedOptions = field.value || []
                      if (e.target.checked) {
                        field.onChange([...selectedOptions, e.target.value])
                      } else {
                        field.onChange(
                          selectedOptions.filter(
                            (option: string) => option !== e.target.value,
                          ),
                        )
                      }
                    }}
                  />
                  Opção 2
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="opcao3"
                    checked={field.value?.includes('opcao3') || false}
                    onChange={(e) => {
                      const selectedOptions = field.value || []
                      if (e.target.checked) {
                        field.onChange([...selectedOptions, e.target.value])
                      } else {
                        field.onChange(
                          selectedOptions.filter(
                            (option: string) => option !== e.target.value,
                          ),
                        )
                      }
                    }}
                  />
                  Opção 3
                </label>
              </div>
            )}
          />
        )
      case 'TRUE_FALSE':
        return (
          <Controller
            name={question.id.toString()}
            control={control}
            render={({ field }) => (
              <div>
                <label>
                  <input
                    type="radio"
                    value="true"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                  />
                  Verdadeiro
                </label>
                <label>
                  <input
                    type="radio"
                    value="false"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                  />
                  Falso
                </label>
              </div>
            )}
          />
        )

      case 'SHORT_ANSWER':
        return (
          <input
            type="text"
            id={`question-${question.id}`}
            {...register(question.id.toString())}
          />
        )
      case 'RATING':
        return (
          <input
            type="number"
            id={`question-${question.id}`}
            {...register(question.id.toString())}
            min={1}
            max={5} // Por exemplo, de 1 a 5 estrelas
          />
        )
      case 'DATE':
        return (
          <input
            type="date"
            id={`question-${question.id}`}
            {...register(question.id.toString())}
          />
        )
      case 'TIME':
        return (
          <input
            type="time"
            id={`question-${question.id}`}
            {...register(question.id.toString())}
          />
        )
      case 'NUMBER':
        return (
          <input
            type="number"
            id={`question-${question.id}`}
            {...register(question.id.toString())}
          />
        )
      case 'MULTI_SELECT':
        return (
          <Controller
            name={question.id.toString()}
            control={control}
            render={({ field }) => (
              <Select multiple {...field}>
                <option value="opcao1">Opção 1</option>
                <option value="opcao2">Opção 2</option>
                <option value="opcao3">Opção 3</option>
              </Select>
            )}
          />
        )
      case 'DROPDOWN':
        return (
          <Controller
            name={question.id.toString()}
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="">Selecione uma opção</option>
                <option value="opcao1">Opção 1</option>
                <option value="opcao2">Opção 2</option>
              </select>
            )}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {form.sections.map((section) => {
        const sectionSchema = generateZodSchema(section.questions)
        const valuesDefault: Record<number, string> = {}
        section.questions.forEach((question) => {
          valuesDefault[question.id] = question.answers?.value ?? ''
        })

        console.log(section)

        const {
          register,
          handleSubmit,
          control,
          formState: { errors, isDirty, isSubmitting },
        } = useForm({
          resolver: zodResolver(sectionSchema),
          values: valuesDefault,
        })

        const onSubmit = async (data: Record<string, string>) => {
          try {
            const params: UpdateAnswerParams = {
              id: form.id,
              sectionId: Number(section.id),
              questionId: 0,
            }

            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const value = data[key]
                params.questionId = Number(key)
                const body: UpdateAnswerBody = {
                  value,
                  observation: 'teste',
                }
                await updateAnswer(params, body)
              }
            }
            toast.success(
              `Os dados da Anamnese da seção ${section.title} foram atualizados com sucesso.`,
            )
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
            <Tabs.Content key={section.id} value={`tab-${section.id}`}>
              <div className="flex items-center gap-3 mb-8">
                {ICON_MAP[section.icon] || <ListTodo className="size-5" />}
                <h2 className="text-xl">{section.title}</h2>
              </div>

              <form
                key={section.id}
                className="w-full flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md space-y-6">
                  {section.description && <p>{section.description}</p>}
                  {section.questions.map((question) => (
                    <div key={question.id} className="flex flex-col">
                      <section className="w-full flex flex-col gap-3">
                        <Label className="inline-block text-md text-slate-400">
                          {question.title}
                        </Label>
                        {renderQuestion(question, register, control)}
                        {errors[question.id] && (
                          <span>This field is required</span>
                        )}
                      </section>
                    </div>
                  ))}
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
                </div>
              </form>
            </Tabs.Content>
          </>
        )
      })}
    </div>
  )
}

export default DynamicForm
