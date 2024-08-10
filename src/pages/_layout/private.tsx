import { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'

import { Loader2 } from 'lucide-react'

interface PrivateRoutesProps {
  children: ReactNode
}

export function PrivateRoutes({ children }: PrivateRoutesProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in?logout=true" replace />
  }

  return <>{children}</>
}
