import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AthleteStatus } from '@/components/athlete-status'

import { TableCell, TableRow } from '@/components/ui/table'

import { Search, Trash2, Undo2 } from 'lucide-react'

import { Link } from 'react-router-dom'

import { GetAthletesResponse } from '@/api/get-athletes'

import { updateAthleteStatus } from '@/api/update-athlete-status'

import { toast } from 'sonner'

import { bloodTypeMap, genderMap, handednessMap } from '@/utils/i18n'

interface AthleteTableRowProps {
  athlete: {
    id: string
    age: number
    status: 'active' | 'inactive'
    name: string
    birth_date: Date
    blood_type:
      | 'a_positive'
      | 'a_negative'
      | 'b_positive'
      | 'b_negative'
      | 'ab_positive'
      | 'ab_negative'
      | 'o_positive'
      | 'o_negative'
    gender: 'male' | 'female'
    handedness: 'right' | 'left'
  }
}

export function AthleteTableRow({ athlete }: AthleteTableRowProps) {
  const queryClient = useQueryClient()

  function updateAthleteStatusOnCache(
    athleteId: string,
    status: AthleteStatus,
  ) {
    const athletesListCache = queryClient.getQueriesData<GetAthletesResponse>({
      queryKey: ['athletes'],
    })

    for (const [cacheKey, cacheData] of athletesListCache) {
      if (!cacheData) return

      queryClient.setQueryData<GetAthletesResponse>(cacheKey, {
        ...cacheData,

        athletes: cacheData.athletes.map((athlete) => {
          if (athlete.id === athleteId) {
            return {
              ...athlete,

              status,
            }
          }

          return athlete
        }),
      })
    }
  }

  const { mutateAsync: updateAthleteStatusFn, isPending: isChangingStatus } =
    useMutation({
      mutationFn: updateAthleteStatus,

      async onSuccess(_, { athleteId }) {
        toast.success(`O status do ${athlete.name} atualizado com sucesso!`)

        updateAthleteStatusOnCache(
          athleteId,
          athlete.status === 'active' ? 'inactive' : 'active',
        )
      },

      async onError() {
        toast.error('Erro ao atualizar o status do atleta')
      },
    })

  return (
    <TableRow>
      <TableCell className="flex items-center justify-center">
        <Link
          to={`/athletes/${athlete.id}`}
          className="size-9 border border-slate-800 rounded-md flex items-center justify-center hover:bg-slate-700/60"
        >
          <Search className="size-4" />
        </Link>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-300">{athlete.name}</span>
        </div>
      </TableCell>

      <TableCell className="text-slate-300">{athlete.age} anos</TableCell>

      <TableCell className="text-slate-300">
        {handednessMap[athlete.handedness]}
      </TableCell>

      <TableCell className="text-slate-300">
        {genderMap[athlete.gender]}
      </TableCell>

      <TableCell className="text-slate-300">
        {bloodTypeMap[athlete.blood_type]}
      </TableCell>

      <TableCell className="text-slate-300">
        <AthleteStatus status={athlete.status} />
      </TableCell>

      <TableCell className="">
        <button
          type="button"
          onClick={() =>
            updateAthleteStatusFn({
              athleteId: athlete.id,
              status: athlete.status === 'active' ? 'inactive' : 'active',
            })
          }
          title={`${athlete.status === 'active' ? 'Inative o atleta' : 'Ative o atleta'}`}
          disabled={isChangingStatus}
          className="border gap-2 size-9 border-slate-800 rounded-md flex items-center justify-center hover:bg-slate-700/60"
        >
          {athlete.status === 'active' ? (
            <Trash2 className="size-4" />
          ) : (
            <Undo2 className="size-4" />
          )}
        </button>
      </TableCell>
    </TableRow>
  )
}
