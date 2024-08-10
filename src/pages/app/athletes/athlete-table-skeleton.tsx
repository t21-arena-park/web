import { Skeleton } from '@/components/ui/skeleton'

import { TableCell, TableRow } from '@/components/ui/table'

import { Search } from 'lucide-react'

export function AthleteTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell className="w-[64px]">
        <div className="size-9 border cursor-pointer border-slate-800 rounded-md flex items-center justify-center hover:bg-slate-700/60">
          <Search className="size-4" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[300px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[110px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[110px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[92px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-[64px]" />
      </TableCell>
    </TableRow>
  ))
}
