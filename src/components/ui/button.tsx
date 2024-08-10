import { ComponentProps, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none disabled:opacity-70 text-sm font-medium transition-colors flex-shrink-0 duration-200 ease-in-out relative inline-flex cursor-pointer items-center justify-center rounded border border-transparent',

  variants: {
    variant: {
      default:
        'text-sm bg-slate-800 font-bold text-slate-200 hover:bg-slate-700',
      primary:
        'bg-lime-600 font-bold text-sm text-lime-950 hover:enabled:bg-lime-700 gap-1',
      secondary: 'bg-slate-700 hover:enabled:bg-slate-800',
      outline:
        'bg-transparent border border-slate-700 hover:enabled:bg-slate-700',
      icon: 'bg-slate-700 hover:enabled:bg-slate-700/80',
    },
    size: {
      xs: 'h-8 rounded-md px-2.5',
      sm: 'h-9 rounded-md px-3',
      default: 'px-8 py-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={button({ variant, size, className })}
      />
    )
  },
)

Button.displayName = 'Button'
