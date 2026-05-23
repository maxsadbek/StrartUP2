import { Link } from 'react-router-dom'
import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificationsStore } from '@/store/notificationsStore'
import { Bell, TrendingDown, Truck, Heart, Megaphone, Info } from 'lucide-react'
import type { NotificationType } from '@/types/notification'
import { cn } from '@/utils/cn'

const icons: Record<NotificationType, typeof Bell> = {
  price: TrendingDown,
  delivery: Truck,
  favorite: Heart,
  promo: Megaphone,
  system: Info,
}

export default function NotificationsPage() {
  const { items, markRead, markAllRead, unreadCount } = useNotificationsStore()

  return (
    <>
      <AppHeader title="Notifications" />
      <PageTransition className="p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {unreadCount > 0 && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                Mark all read
              </Button>
            </div>
          )}
          {items.map((n) => {
            const Icon = icons[n.type]
            const content = (
              <Card
                className={cn(
                  'transition-colors hover:bg-muted/30',
                  !n.read && 'border-l-4 border-l-accent',
                )}
              >
                <CardContent className="flex gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.title}</p>
                      {!n.read && <Badge variant="success" className="text-[10px]">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
            return n.link ? (
              <Link key={n.id} to={n.link} onClick={() => markRead(n.id)}>
                {content}
              </Link>
            ) : (
              <button key={n.id} type="button" className="w-full text-left" onClick={() => markRead(n.id)}>
                {content}
              </button>
            )
          })}
        </div>
      </PageTransition>
    </>
  )
}
