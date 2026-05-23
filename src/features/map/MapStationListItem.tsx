import { motion } from 'framer-motion'
import { MapPin, Star, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDistance, formatPrice, formatQueue } from '@/utils/format'
import type { FuelStation } from '@/types/station'
import { cn } from '@/utils/cn'

interface MapStationListItemProps {
  station: FuelStation
  distanceKm: number
  selected: boolean
  rank?: number
  onClick: () => void
}

export function MapStationListItem({
  station,
  distanceKm,
  selected,
  rank,
  onClick,
}: MapStationListItemProps) {
  const cheapest = station.prices
    .filter((p) => p.available)
    .sort((a, b) => a.price - b.price)[0]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'w-full rounded-xl border p-3 text-left transition-all',
        selected
          ? 'border-accent bg-accent/5 shadow-md ring-2 ring-accent/30'
          : 'border-border bg-card hover:border-accent/40 hover:shadow-sm',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {rank !== undefined && rank <= 3 && (
              <Badge variant={rank === 1 ? 'success' : 'outline'} className="text-[10px]">
                {rank === 1 ? 'Eng yaqin' : `#${rank}`}
              </Badge>
            )}
            <h3 className="truncate font-display text-sm font-semibold">{station.name}</h3>
          </div>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {station.address}
          </p>
        </div>
        {cheapest && (
          <span className="shrink-0 text-sm font-bold text-fuel-green">
            {formatPrice(cheapest.price)}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {station.prices.filter((p) => p.available).map((p) => (
          <Badge key={p.type} variant="outline" className="text-[9px] px-1.5 py-0">
            {p.label.split(' ')[0]}
          </Badge>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-fuel-orange text-fuel-orange" />
          {station.rating}
        </span>
        <span>{formatDistance(distanceKm)}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatQueue(station.queueMinutes)}
        </span>
        <Badge variant={station.isOpen ? 'success' : 'muted'} className="text-[10px]">
          {station.isOpen ? 'Ochiq' : 'Yopiq'}
        </Badge>
      </div>
    </motion.button>
  )
}
