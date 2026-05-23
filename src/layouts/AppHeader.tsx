import { Search, Moon, Sun, Car, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useNotificationsStore } from '@/store/notificationsStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AppHeaderProps {
  title?: string
  onSearchClick?: () => void
}

export function AppHeader({ title, onSearchClick }: AppHeaderProps) {
  const { resolved, toggle } = useThemeStore()
  const user = useAuthStore((s) => s.user)
  const setTaxiMode = useAuthStore((s) => s.setTaxiMode)
  const unread = useNotificationsStore((s) => s.unreadCount)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="truncate font-display text-lg font-semibold lg:text-xl">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 sm:flex"
            onClick={onSearchClick}
          >
            <Search className="h-4 w-4" />
            <span className="text-muted-foreground">Search...</span>
            <kbd className="rounded border border-border px-1 text-[10px]">⌘K</kbd>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={onSearchClick}>
            <Search className="h-4 w-4" />
          </Button>
          <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 sm:flex">
            <Car className="h-4 w-4 text-fuel-orange" />
            <Label htmlFor="taxi-mode" className="text-xs">
              Taxi mode
            </Label>
            <Switch
              id="taxi-mode"
              checked={user?.isTaxiMode ?? false}
              onCheckedChange={setTaxiMode}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to={ROUTES.notifications} className="relative">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            {unread > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-fuel-orange" />
            )}
          </Link>
          <Link to={ROUTES.profile}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {user?.name?.slice(0, 2).toUpperCase() ?? 'FG'}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
