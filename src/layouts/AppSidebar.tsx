import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Fuel,
  Heart,
  Truck,
  User,
  Settings,
  Bell,
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { ROUTES } from '@/constants/routes'
import { useNotificationsStore } from '@/store/notificationsStore'
import { cn } from '@/utils/cn'

const navItems = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.map, icon: Map, label: 'Xarita' },
  { to: ROUTES.stations, icon: Fuel, label: 'Stations' },
  { to: ROUTES.favorites, icon: Heart, label: 'Favorites' },
  { to: ROUTES.delivery, icon: Truck, label: 'Delivery' },
  { to: ROUTES.notifications, icon: Bell, label: 'Alerts', badge: true },
  { to: ROUTES.profile, icon: User, label: 'Profile' },
  { to: ROUTES.settings, icon: Settings, label: 'Settings' },
]

export function AppSidebar() {
  const unread = useNotificationsStore((s) => s.unreadCount)

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/50 lg:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <Logo className="mb-8 px-2" />
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
              {badge && unread > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-fuel-orange px-1.5 text-xs text-white">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
