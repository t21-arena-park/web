import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layout/app'
import { AuthLayout } from './pages/_layout/auth'
import { PrivateRoutes } from './pages/_layout/private'
import { SetupLayout } from './pages/_layout/setup'

import { NotFound } from './pages/404'
import { Error } from './pages/error'

import { Dashboard } from './pages/app/dashboard/dashboard'

import { Athletes } from './pages/app/athletes/athletes'

import { Profile } from './pages/app/profile/profile'

import { Organization } from './pages/app/orgs/organization'

import { AthleteProfile } from './pages/app/athlete-profile/athlete-profile'

import { Anamnesis } from './pages/app/anamnesis/anamnesis'

import { SignIn } from './pages/app/auth/sign-in'
import { Forgot } from './pages/app/auth/forgot'

import { AuthProvider } from './contexts/auth-context'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <PrivateRoutes>
          <AppLayout />
        </PrivateRoutes>
      </AuthProvider>
    ),

    errorElement: <Error />,

    children: [
      { path: '/', element: <Dashboard /> },

      {
        path: '/athletes',
        element: <Athletes />,
      },
    ],
  },

  {
    path: '/',

    element: (
      <AuthProvider>
        <PrivateRoutes>
          <SetupLayout />
        </PrivateRoutes>
      </AuthProvider>
    ),

    errorElement: <Error />,

    children: [
      {
        path: '/athletes/:id',
        element: <AthleteProfile />,
      },

      {
        path: '/me',
        element: <Profile />,
      },

      {
        path: '/mine',
        element: <Organization />,
      },

      {
        path: '/anamnesis/:id',
        element: <Anamnesis />,
      },
    ],
  },

  {
    path: '/',
    element: <AuthLayout />,

    errorElement: <Error />,

    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },

      {
        path: '/forgot',
        element: <Forgot />,
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
])
