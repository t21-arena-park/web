import { useEffect, useState } from 'react'

import { api } from '@/lib/axios'

import { Outlet, useNavigate } from 'react-router-dom'

import { isAxiosError } from 'axios'

import { Header } from '@/components/header'
import { Navbar } from '@/components/navbar'

export function AppLayout() {
  const navigate = useNavigate()

  const [isNavbarOpen, setIsNavbarOpen] = useState(false)

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          const code = error.response?.data.code

          if (status === 401 && code === 'UNAUTHORIZED') {
            navigate('/sign-in', { replace: true })
          }

          if (status === 403 && code === 'FORBIDDEN') {
            navigate('/sign-in', { replace: true })
          }
        }
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-200 grid grid-cols-1 lg:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Header isOpen={isNavbarOpen} onClickOpen={setIsNavbarOpen} />

      <Navbar isOpen={isNavbarOpen} />

      <div className="flex-1 flex flex-col gap-4 p-8 pt-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
