import * as Tabs from '@radix-ui/react-tabs'
import { getAnamnesis } from '@/api/get-anamnesis'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, ListTodo, Loader2 } from 'lucide-react'

import DynamicForm from './dynamic-form'

const ICON_MAP: Record<string, JSX.Element> = {
  LIST_TODO: <ListTodo className="size-5" />,
}

export function Anamnesis() {
  const params = useParams<{ id: string }>()
  const id = params.id ?? ''

  const { data: anamnesis, isLoading: isPageLoading } = useQuery({
    queryKey: ['anamnesis', id],
    queryFn: () => getAnamnesis({ id }),
    enabled: id !== '',
  })

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
                <div>
                  <DynamicForm form={anamnesis} />
                </div>
              </main>
            </Tabs.Root>
          )}
        </div>
      </div>
    </>
  )
}
