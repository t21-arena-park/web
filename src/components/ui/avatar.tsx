import * as React from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

export interface AvatarProps {
  initials: string | React.ReactNode
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ initials, ...props }, ref) => {
    return (
      <AvatarPrimitive.Avatar
        ref={ref}
        className="size-12 border border-slate-700 rounded-full overflow-hidden flex items-center justify-center"
        {...props}
      >
        <AvatarPrimitive.Fallback className="text-violet11 cursor-pointer leading-1 flex h-full w-full items-center justify-center bg-slate-600 text-lg font-medium">
          {initials}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Avatar>
    )
  },
)

Avatar.displayName = 'Avatar'
