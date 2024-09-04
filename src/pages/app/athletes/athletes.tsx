import { Helmet } from 'react-helmet-async'

import { Pagination } from '@/components/pagination'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useSearchParams } from 'react-router-dom'

import { z } from 'zod'

import { useQuery } from '@tanstack/react-query'

import { getAthletes } from '@/api/get-athletes'

import { AthleteTableRow } from './athlete-table-row'
import { AthleteTableSkeleton } from './athlete-table-skeleton'
import { AthleteTableFilters } from './athlete-table-filters'
import { AthleteDialog } from './athlete-dialog'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

export function Athletes() {
  const [searchParams, setSearchParams] = useSearchParams()

  const athleteName = searchParams.get('athleteName')
  const status = searchParams.get('status') ?? 'active'

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingAthletes } = useQuery({
    queryKey: ['athletes', pageIndex, athleteName, status],
    queryFn: () => getAthletes({ pageIndex, athleteName, status }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (pageIndex + 1).toString())

      return state
    })
  }

  return (
    <>
      <Helmet title="Atletas" />

      <div className="flex flex-col gap-4">
        <div className="space-y-2 mb-3">
          <h1 className="text-3xl font-bold tracking-tight font-error">
            Atletas
          </h1>

          <p className="text-base text-slate-400">
            Visualize as informações dos seus atletas cadastrados na plataforma.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <AthleteTableFilters />

            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="primary" size="xs">
                  Cadastrar
                </Button>
              </DialogTrigger>

              <AthleteDialog />
            </Dialog>
          </div>

          <div className="rounded-lg border overflow-hidden border-slate-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[320px]">Nome</TableHead>
                  <TableHead className="w-[140px]">Idade</TableHead>
                  <TableHead className="w-[140px]">Lateralidade</TableHead>
                  <TableHead className="w-[140px]">Sexo</TableHead>
                  <TableHead className="w-[140px]">Tipo sanguíneo</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoadingAthletes && <AthleteTableSkeleton />}

                {result && result.athletes.length > 0 ? (
                  result.athletes.map((athlete) => (
                    <AthleteTableRow key={athlete.id} athlete={athlete} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className={`text-center text-slate-400 ${isLoadingAthletes && 'hidden'}`}
                    >
                      Nenhum atleta encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {result && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={result.meta.pageIndex}
            perPage={result.meta.perPage}
            totalCount={result.meta.totalCount}
          />
        )}
      </div>
    </>
  )
}
