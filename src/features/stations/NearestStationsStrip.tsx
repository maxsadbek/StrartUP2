import { motion } from 'framer-motion'
import { MapPin, ChevronRight } from 'lucide-react'
import { useNearestStations } from '@/hooks/useNearestStations'
import { formatDistance, formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'

interface NearestStationsStripProps {
  onSelect: (id: string) => void
  selectedId: string | null
}

export function NearestStationsStrip({ onSelect, selectedId }: NearestStationsStripProps) {
  const { nearest, isLoading } = useNearestStations(5)

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 w-40 shrink-0 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-md">
      <p className="px-4 pt-2 text-xs font-medium text-muted-foreground">Eng yaqin</p>
      <div className="flex gap-2 overflow-x-auto px-4 py-2 pb-3">
        {nearest.map((s, i) => {
          const min = s.prices.filter((p) => p.available).sort((a, b) => a.price - b.price)[0]
          const selected = selectedId === s.id
          return (
            <motion.button
              key={s.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(s.id)}
              className={cn(
                'flex min-w-[160px] shrink-0 flex-col rounded-xl border px-3 py-2 text-left transition-all',
                selected
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
                  : 'border-border bg-card hover:border-accent/50',
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-xs font-semibold">{s.name}</span>
                {i === 0 && (
                  <span className="shrink-0 rounded bg-fuel-green/15 px-1.5 py-0.5 text-[9px] font-bold text-fuel-green">
                    #1
                  </span>
                )}
              </div>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {formatDistance(s.distanceKm)}
              </span>
              {min && (
                <span className="mt-1 text-xs font-bold text-fuel-green">
                  {formatPrice(min.price)}
                </span>
              )}
              <ChevronRight className="mt-1 h-3 w-3 self-end text-muted-foreground" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
