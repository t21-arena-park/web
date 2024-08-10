import { BarChart, Loader2 } from 'lucide-react'

import { getLastWeekAthletesAmount } from '@/api/get-last-week-athletes-amount'

import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
} from 'recharts'

import colors from 'tailwindcss/colors'

import { useQuery } from '@tanstack/react-query'

export function LastWeekAthletesAmountChart() {
  const { data: lastWeekAthletesAmount } = useQuery({
    queryKey: ['metrics', 'last-week-athletes-amount'],
    queryFn: getLastWeekAthletesAmount,
  })

  return (
    <div className="col-span-6 max-[1100px]:col-span-full">
      <div className="rounded-lg border border-slate-700 text-slate-200 shadow-sm">
        <div className="flex p-6 items-center pb-2 justify-between">
          <h3 className="tracking-tighter text-base font-semibold">
            Atletas criados na última semana
          </h3>

          <BarChart className="size-5 text-slate-600" />
        </div>

        <div className="p-8 pl-0 pt-4 space-y-1">
          {lastWeekAthletesAmount ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lastWeekAthletesAmount} style={{ fontSize: 12 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  dy={16}
                />

                <YAxis
                  stroke="#888"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />

                <CartesianGrid vertical={false} className="stroke-slate-700" />

                <Line
                  stroke={colors.lime[500]}
                  type="linear"
                  strokeWidth={2}
                  dataKey="count"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[240px] w-full items-center justify-center">
              <Loader2 className="size-8 animate-spin text-slate-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
