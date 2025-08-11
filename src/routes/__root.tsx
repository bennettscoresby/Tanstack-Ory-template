import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import type { AuthState } from '../hooks/useAuth'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import Sidebar from '@/components/Nav/SideNav.tsx'

interface MyRouterContext {
  queryClient: QueryClient,
  authentication: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="flex h-screen overflow-hidden">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>
      <div className="main-content-wrapper flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </div>
  ),
})
