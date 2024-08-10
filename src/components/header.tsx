import { Button } from '@/components/ui/button'

import MenuRightIcon from '@/assets/menu-right.svg'
import MenuLeftIcon from '@/assets/menu-left.svg'

import { AccountMenu } from './account-menu'

import { AlignJustify, ChevronLeft, Home, UsersRound } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

import { NavLink } from './nav-link'

import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  hasGoBackButton?: boolean
  isOpen?: boolean

  onClickOpen?: (isOpen: boolean) => void
}

export function Header({
  hasGoBackButton = false,
  isOpen,
  onClickOpen,
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="col-span-full h-[72px] lg:[80px] px-4 lg:pr-8 bg-slate-800 border border-transparent border-b-slate-700 flex items-center justify-between">
      {hasGoBackButton ? (
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="h-10 w-10 bg-slate-700 hover:enabled:bg-slate-700/80 items-center text-sm font-medium transition-colors flex-shrink-0 duration-200 ease-in-out relative inline-flex cursor-pointer justify-center rounded border border-transparent"
            title="Voltar para a última página"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="size-5" color="#C4C4CC" />
          </button>

          <Link to="/" className="font-bold font-error text-xl">
            T21 Arena Park
          </Link>
        </div>
      ) : (
        <DropdownMenu>
          <div className="flex items-center gap-5">
            <Button
              size="icon"
              variant="icon"
              className="hidden lg:flex"
              title="Expandir menu de navegação"
              onClick={() => onClickOpen && onClickOpen(!isOpen)}
            >
              <img src={isOpen ? MenuLeftIcon : MenuRightIcon} alt="" />
            </Button>

            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="lg:hidden h-10 w-10 bg-slate-700 hover:enabled:bg-slate-700/80 items-center text-sm font-medium transition-colors flex-shrink-0 duration-200 ease-in-out relative inline-flex cursor-pointer justify-center rounded border border-transparent"
                title="Abrir menu de navegação"
              >
                <AlignJustify color="#C4C4CC" className="size-5" />
              </button>
            </DropdownMenuTrigger>

            <Link to="/" className="font-bold font-error text-xl">
              T21 Arena Park
            </Link>
          </div>

          <DropdownMenuContent
            align="start"
            className="w-60 lg:hidden overflow-hidden border-slate-700 bg-slate-800"
          >
            <DropdownMenuItem
              className="flex items-center cursor-pointer gap-4 md:px-4 px-2 py-3 hover:bg-slate-700 transition outline-none text-slate-400 data-[current='true']:text-lime-400"
              asChild
            >
              <NavLink to="/">
                <Home className="size-5" />
                Dashboard
              </NavLink>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center cursor-pointer gap-4 md:px-4 px-2 py-3 hover:bg-slate-700 transition outline-none text-slate-400 data-[current='true']:text-lime-400"
              asChild
            >
              <NavLink to="/athletes">
                <UsersRound className="size-5" />
                Atletas
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AccountMenu />
    </div>
  )
}
