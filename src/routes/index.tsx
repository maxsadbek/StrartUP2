import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'

const LandingPage = lazy(() => import('@/pages/landing/LandingPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const MapPage = lazy(() => import('@/pages/map/MapPage'))
const StationsPage = lazy(() => import('@/pages/stations/StationsPage'))
const StationDetailPage = lazy(() => import('@/pages/stations/StationDetailPage'))
const FavoritesPage = lazy(() => import('@/pages/favorites/FavoritesPage'))
const DeliveryPage = lazy(() => import('@/pages/delivery/DeliveryPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  )
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.home,
        element: (
          <SuspenseWrap>
            <LandingPage />
          </SuspenseWrap>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.login,
        element: (
          <SuspenseWrap>
            <LoginPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.register,
        element: (
          <SuspenseWrap>
            <RegisterPage />
          </SuspenseWrap>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.dashboard,
        element: (
          <SuspenseWrap>
            <DashboardPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.map,
        element: (
          <SuspenseWrap>
            <MapPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.stations,
        element: (
          <SuspenseWrap>
            <StationsPage />
          </SuspenseWrap>
        ),
      },
      {
        path: '/station/:id',
        element: (
          <SuspenseWrap>
            <StationDetailPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.favorites,
        element: (
          <SuspenseWrap>
            <FavoritesPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.delivery,
        element: (
          <SuspenseWrap>
            <DeliveryPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.profile,
        element: (
          <SuspenseWrap>
            <ProfilePage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.settings,
        element: (
          <SuspenseWrap>
            <SettingsPage />
          </SuspenseWrap>
        ),
      },
      {
        path: ROUTES.notifications,
        element: (
          <SuspenseWrap>
            <NotificationsPage />
          </SuspenseWrap>
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.home} replace /> },
])
