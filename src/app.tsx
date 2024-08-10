import { QueryClientProvider } from '@tanstack/react-query'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import { Toaster } from 'sonner'

import { queryClient } from './lib/react-query'

import { RouterProvider } from 'react-router-dom'

import { router } from './routes'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | T21 Arena Park" />

      <Toaster richColors />

      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
