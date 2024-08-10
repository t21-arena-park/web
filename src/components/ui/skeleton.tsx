import type { ComponentProps } from 'react'

import { twMerge } from 'tailwind-merge'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('animate-pulse rounded-md bg-slate-700/80', className)}
      {...props}
    ></div>
  )
}
