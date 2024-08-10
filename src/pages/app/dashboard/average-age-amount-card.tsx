import { PartyPopper } from 'lucide-react'

import { MetricCardSkeleton } from './metric-card-skeleton'

import { getAverageAgeAmount } from '@/api/get-average-age-amount'

import { useQuery } from '@tanstack/react-query'

export function AverageAgeAmountCard() {
  const { data: averageAgeAmount } = useQuery({
    queryKey: ['metrics', 'average-age-amount'],
    queryFn: getAverageAgeAmount,
  })

  return (
    <div className="rounded-lg border border-slate-700 text-slate-200 shadow-sm">
      <div className="flex p-6 items-center pb-2 justify-between">
        <h3 className="tracking-tighter text-base font-semibold">
          Idade média dos atletas
        </h3>

        <PartyPopper className="size-5 text-slate-600" />
      </div>

      <div className="p-6 pt-0 space-y-1">
        {averageAgeAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {averageAgeAmount.amount.toLocaleString('pt-BR')}
            </span>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </div>
    </div>
  )
}
