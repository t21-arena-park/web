import { ShieldCheck } from 'lucide-react'

import { MetricCardSkeleton } from './metric-card-skeleton'

import { getGuardiansAmount } from '@/api/get-guardians-amount'

import { useQuery } from '@tanstack/react-query'

export function GuardiansAmountCard() {
  const { data: guardiansAmount } = useQuery({
    queryKey: ['metrics', 'guardians-amount'],
    queryFn: getGuardiansAmount,
  })

  return (
    <div className="rounded-lg border border-slate-700 text-slate-200 shadow-sm">
      <div className="flex p-6 items-center pb-2 justify-between">
        <h3 className="tracking-tighter text-base font-semibold">
          Total de responsáveis
        </h3>

        <ShieldCheck className="size-5 text-slate-600" />
      </div>

      <div className="p-6 pt-0 space-y-1">
        {guardiansAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {guardiansAmount.amount.toLocaleString('pt-BR')}
            </span>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </div>
    </div>
  )
}
