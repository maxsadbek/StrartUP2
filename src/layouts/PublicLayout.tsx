import { Outlet } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <Outlet />
    </div>
  )
}
