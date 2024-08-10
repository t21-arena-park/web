import { ResponsiveContainer, Pie, PieChart, Cell } from 'recharts'

import { BarChart, Loader2Icon } from 'lucide-react'

import colors from 'tailwindcss/colors'

import { useQuery } from '@tanstack/react-query'

import { getAthletesByGenderAmount } from '@/api/get-athletes-by-gender-amount'

import { genderMap } from '@/utils/i18n'

const COLORS = [
  colors.lime[500],
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.rose[500],
]

export function AthletesGenderAmountChart() {
  const { data } = useQuery({
    queryKey: ['metrics', 'athletes-gender-amount'],
    queryFn: getAthletesByGenderAmount,
  })

  const athletesGenderAmount = data?.map((item) => ({
    ...item,

    gender: genderMap[item.gender],
  }))

  return (
    <div className="col-span-3">
      <div className="rounded-lg border border-slate-700 text-slate-200 shadow-sm">
        <div className="flex p-6 items-start pb-2 justify-between">
          <div className="space-y-1">
            <h3 className="tracking-tighter text-base font-semibold">
              Quantidade de atletas por sexo
            </h3>

            <p className="text-sm text-slate-400">
              Esse é um gráfico que mostra o sexo dos atletas
            </p>
          </div>

          <BarChart className="size-5 text-slate-600" />
        </div>

        <div className="p-6 pt-0 space-y-1">
          {athletesGenderAmount ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart style={{ fontSize: 12 }}>
                <Pie
                  data={athletesGenderAmount}
                  dataKey="amount"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={86}
                  innerRadius={64}
                  strokeWidth={8}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180
                    const radius =
                      12 + innerRadius + (outerRadius - innerRadius)
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)

                    return (
                      <text
                        x={x}
                        y={y}
                        className="fill-slate-300 text-xs"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {athletesGenderAmount[index].gender.length > 12
                          ? athletesGenderAmount[index].gender
                              .substring(0, 12)
                              .concat('...')
                          : athletesGenderAmount[index].gender}{' '}
                        ({value})
                      </text>
                    )
                  }}
                >
                  {athletesGenderAmount.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      className="stroke-slate-900 hover:opacity-80"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[240px] w-full items-center justify-center">
              <Loader2Icon className="size-8 animate-spin text-slate-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
