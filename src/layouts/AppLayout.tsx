import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { MobileNav } from './MobileNav'
import { CommandPalette } from '@/features/search/CommandPalette'
import { useLocationStore } from '@/store/locationStore'
import { loadAllStations } from '@/services/stations.repository'

export function AppLayout() {
  const initLocation = useLocationStore((s) => s.initLocation)

  useEffect(() => {
    initLocation()
    loadAllStations().catch(console.warn)
  }, [initLocation])

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <Outlet />
      </div>
      <MobileNav />
      <CommandPalette />
    </div>
  )
}
