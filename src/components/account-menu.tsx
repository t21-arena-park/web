import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Loader2, LogOut, Settings, Wrench } from 'lucide-react'

import { getProfile } from '@/api/get-profile'

import { signOut } from '@/api/sign-out'

import { useMutation, useQuery } from '@tanstack/react-query'

import { Link, useNavigate } from 'react-router-dom'

import { Avatar } from './ui/avatar'

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,

    onSuccess: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          initials={
            (profile?.initials || isLoadingProfile) ?? (
              <Loader2 className="size-5 text-slate-400" />
            )
          }
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-30px)] max-w-[354px] overflow-hidden"
      >
        <div className="flex items-center gap-4 md:px-6 px-4 py-4 outline-none">
          <Avatar
            initials={
              (profile?.initials || isLoadingProfile) ?? (
                <Loader2 className="size-5 text-slate-400" />
              )
            }
          />

          <div className="flex flex-col gap-1">
            <strong className="line-clamp-1 text-sm text-slate-100 font-bold first-letter:uppercase">
              {profile?.name}
            </strong>

            <span className="line-clamp-1 text-xs text-slate-400">
              {profile?.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-700" />

        <DropdownMenuItem
          className="flex items-center cursor-pointer gap-4 md:px-6 px-4 py-2 hover:bg-slate-700 transition outline-none"
          asChild
        >
          <Link to="/mine">
            <Wrench className="size-5 text-slate-400" />

            <div className="flex flex-col gap-1">
              <DropdownMenuLabel className="py-0">
                Minha organização
              </DropdownMenuLabel>

              <p className="text-xs text-slate-400 px-2">
                Gerencie voluntários e endereço
              </p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-700" />

        <DropdownMenuItem
          className="flex items-center cursor-pointer gap-4 md:px-6 px-4 py-2 hover:bg-slate-700 transition outline-none"
          asChild
        >
          <Link to="/me">
            <Settings className="size-5 text-slate-400" />

            <div className="flex flex-col gap-1">
              <DropdownMenuLabel className="py-0">
                Minha conta
              </DropdownMenuLabel>

              <p className="text-xs text-slate-400 px-2">
                Gerencie dados e preferências
              </p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-700" />

        <DropdownMenuItem
          asChild
          disabled={isSigningOut}
          className="flex items-center gap-4 p-4 md:px-6 w-full text-left hover:bg-slate-700 transition outline-none text-rose-400 font-semibold text-sm cursor-pointer"
        >
          <button type="button" className="w-full" onClick={() => signOutFn()}>
            <LogOut className="size-5" />
            <span>Sair</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
