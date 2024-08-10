import { useEffect } from 'react'

import { Header } from '@/components/header'

import { isAxiosError } from 'axios'

import { api } from '@/lib/axios'

import { Outlet, useNavigate } from 'react-router-dom'

export function SetupLayout() {
  const navigate = useNavigate()

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
      <Header hasGoBackButton />

      <div className="col-span-full overflow-auto h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)]">
        <Outlet />
      </div>
    </div>
  )
}
