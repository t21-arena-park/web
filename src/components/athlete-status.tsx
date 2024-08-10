export type AthleteStatus = 'active' | 'inactive'

interface AthleteStatusProps {
  status: AthleteStatus
}

const athleteStatusMap: Record<AthleteStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
}

export function AthleteStatus({ status }: AthleteStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'active' && (
        <span className="size-2 bg-emerald-500 rounded-full inline-block"></span>
      )}

      {status === 'inactive' && (
        <span className="size-2 bg-red-500 rounded-full inline-block"></span>
      )}

      <span className="font-medium text-slate-400">
        {athleteStatusMap[status]}
      </span>
    </div>
  )
}
