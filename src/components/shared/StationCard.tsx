import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { formatDistance, formatQueue, formatPrice } from '@/utils/format'
import { useFavoritesStore } from '@/store/favoritesStore'
import type { FuelStation } from '@/types/station'
import { cn } from '@/utils/cn'

interface StationCardProps {
  station: FuelStation
  variant?: 'default' | 'compact' | 'horizontal'
}

export function StationCard({ station, variant = 'default' }: StationCardProps) {
  const { isFavorite, toggle } = useFavoritesStore()
  const fav = isFavorite(station.id)
  const cheapest = station.prices.filter((p) => p.available).sort((a, b) => a.price - b.price)[0]

  if (variant === 'horizontal') {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link to={ROUTES.station(station.id)}>
          <Card className="overflow-hidden hover:shadow-md">
            <div className="flex gap-4 p-4">
              <img
                src={station.images[0]}
                alt={station.name}
                className="h-20 w-24 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-display font-semibold">{station.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.preventDefault()
                      toggle(station.id)
                    }}
                  >
                    <Heart className={cn('h-4 w-4', fav && 'fill-fuel-orange text-fuel-orange')} />
                  </Button>
                </div>
                <p className="truncate text-xs text-muted-foreground">{station.address}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-fuel-orange text-fuel-orange" />
                    {station.rating}
                  </span>
                  <span className="text-muted-foreground">{formatDistance(station.distance)}</span>
                  {cheapest && (
                    <Badge variant="success">{cheapest.label} {formatPrice(cheapest.price)}</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group overflow-hidden hover:shadow-lg">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={station.images[0]}
            alt={station.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
            onClick={() => toggle(station.id)}
          >
            <Heart className={cn('h-4 w-4', fav && 'fill-fuel-orange text-fuel-orange')} />
          </Button>
          {station.isPremium && (
            <Badge className="absolute left-3 top-3 bg-white/90 text-zinc-900">Premium</Badge>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <h3 className="font-display text-lg font-semibold">{station.name}</h3>
              <p className="flex items-center gap-1 text-xs opacity-90">
                <MapPin className="h-3 w-3" />
                {formatDistance(station.distance)}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {formatQueue(station.queueMinutes)}
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-fuel-orange text-fuel-orange" />
              <span className="font-medium">{station.rating}</span>
              <span className="text-muted-foreground">({station.reviewCount})</span>
            </div>
            <Badge variant={station.isOpen ? 'success' : 'muted'}>
              {station.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {station.prices.slice(0, 3).map((p) => (
              <Badge key={p.type} variant="outline" className={!p.available ? 'opacity-50' : ''}>
                {p.label}: {formatPrice(p.price)}
              </Badge>
            ))}
          </div>
          <Link to={ROUTES.station(station.id)} className="mt-4 block">
            <Button className="w-full" variant="outline" size="sm">
              View details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
