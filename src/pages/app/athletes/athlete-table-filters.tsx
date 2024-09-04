import { Controller, useForm } from 'react-hook-form'

import { Control, Input } from '@/components/ui/input'

import { useSearchParams } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import * as Label from '@radix-ui/react-label'

const searchFilterSchema = z.object({
  athleteName: z.string().optional(),
  status: z.string().optional(),
})

type SearchFilterSchema = z.infer<typeof searchFilterSchema>

export function AthleteTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const athleteName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } =
    useForm<SearchFilterSchema>({
      resolver: zodResolver(searchFilterSchema),
      defaultValues: {
        athleteName: athleteName ?? '',
        status: status ?? 'active',
      },
    })

  function handleFilter({ athleteName, status }: SearchFilterSchema) {
    setSearchParams((state) => {
      if (athleteName) {
        state.set('athleteName', athleteName)
      } else {
        state.delete('athleteName')
      }

      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilter() {
    setSearchParams((state) => {
      state.delete('athleteName')
      state.delete('status')

      state.set('page', '1')

      return state
    })

    reset({
      athleteName: '',
      status: 'active',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      action=""
      method="GET"
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <div>
        <Label.Root>
          <Label.Label htmlFor="athlete-name" className="sr-only">
            Nome do atleta
          </Label.Label>
        </Label.Root>

        <Input variant="filter">
          <Control
            id="athlete-name"
            placeholder="Nome do atleta"
            {...register('athleteName')}
          />
        </Input>
      </div>

      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => (
          <Select
            defaultValue="active"
            name={name}
            onValueChange={onChange}
            value={value}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        )}
      ></Controller>

      <Button type="submit" size="xs" variant="secondary">
        <Search className="size-4 mr-2" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        size="xs"
        variant="outline"
        onClick={handleClearFilter}
      >
        <X className="size-4 mr-2" />
        Remover filtros
      </Button>
    </form>
  )
}
