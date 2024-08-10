import { Skeleton } from '@/components/ui/skeleton'

export function OrganizationVolunteerSkeleton() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="border border-slate-700 p-6 rounded-md bg-slate-800/50 flex flex-row justify-between gap-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div>
            <Skeleton className="h-2 w-[100px]"></Skeleton>
            <Skeleton className="h-4 w-[140px]"></Skeleton>
          </div>

          <div>
            <Skeleton className="h-2 w-[100px]"></Skeleton>
            <Skeleton className="h-4 w-[140px]"></Skeleton>
          </div>

          <div>
            <Skeleton className="h-2 w-[100px]"></Skeleton>
            <Skeleton className="h-4 w-[140px]"></Skeleton>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Skeleton className="h-2 w-[60px]"></Skeleton>
          <Skeleton className="h-2 w-[60px]"></Skeleton>
        </div>
      </div>
    </div>
  ))
}
