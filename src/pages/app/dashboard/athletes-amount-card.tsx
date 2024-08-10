import { Users } from 'lucide-react'

import { MetricCardSkeleton } from './metric-card-skeleton'

import { getAthletesAmount } from '@/api/get-athletes-amount'

import { useQuery } from '@tanstack/react-query'

export function AthletesAmountCard() {
  const { data: athletesAmount } = useQuery({
    queryKey: ['metrics', 'athletes-amount'],
    queryFn: getAthletesAmount,
  })

  return (
    <div className="rounded-lg border border-slate-700 text-slate-200 shadow-sm">
      <div className="flex p-6 items-center pb-2 justify-between">
        <h3 className="tracking-tighter text-base font-semibold">
          Total de atletas
        </h3>

        <Users className="size-5 text-slate-600" />
      </div>

      <div className="p-6 pt-0 space-y-1">
        {athletesAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {athletesAmount.amount.toLocaleString('pt-BR')}
            </span>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </div>
    </div>
  )
}
