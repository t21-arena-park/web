import { FileHeart } from 'lucide-react'

import { MetricCardSkeleton } from './metric-card-skeleton'

import { useQuery } from '@tanstack/react-query'

import { getAnamnesisAmount } from '@/api/get-anamnesis-amount'

export function AnamnesisAmountCard() {
  const { data: anamnesisAmount } = useQuery({
    queryKey: ['metrics', 'anamnesis-amount'],
    queryFn: getAnamnesisAmount,
  })

  return (
    <div className="rounded-lg border border-slate-700 text-slate-200 shadow-sm">
      <div className="flex p-6 items-center pb-2 justify-between">
        <h3 className="tracking-tighter text-base font-semibold">
          Total de anamneses
        </h3>

        <FileHeart className="size-5 text-slate-600" />
      </div>

      <div className="p-6 pt-0 space-y-1">
        {anamnesisAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {anamnesisAmount.amount.toLocaleString('pt-BR')}
            </span>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </div>
    </div>
  )
}
