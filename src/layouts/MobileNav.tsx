import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Heart, Truck, User } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const items = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Home' },
  { to: ROUTES.map, icon: Map, label: 'Map' },
  { to: ROUTES.favorites, icon: Heart, label: 'Saved' },
  { to: ROUTES.delivery, icon: Truck, label: 'Delivery' },
  { to: ROUTES.profile, icon: User, label: 'Profile' },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-accent' : 'text-muted-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
