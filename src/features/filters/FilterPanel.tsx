import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useFiltersStore } from '@/store/filtersStore'
import type { FuelType } from '@/types/station'
import { cn } from '@/utils/cn'

const FUEL_OPTIONS: { type: FuelType; label: string }[] = [
  { type: 'ai92', label: 'AI-92' },
  { type: 'ai95', label: 'AI-95' },
  { type: 'ai98', label: 'AI-98' },
  { type: 'diesel', label: 'Diesel' },
  { type: 'gas', label: 'LPG' },
]

const SORT_OPTIONS = [
  { value: 'distance' as const, label: 'Nearest' },
  { value: 'price' as const, label: 'Cheapest' },
  { value: 'rating' as const, label: 'Top rated' },
  { value: 'queue' as const, label: 'Shortest queue' },
]

interface FilterPanelProps {
  className?: string
  collapsed?: boolean
}

export function FilterPanel({ className, collapsed }: FilterPanelProps) {
  const {
    fuelTypes,
    toggleFuelType,
    sortBy,
    setSortBy,
    openNow,
    setOpenNow,
    maxDistance,
    setMaxDistance,
    reset,
  } = useFiltersStore()

  if (collapsed) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {SORT_OPTIONS.map((o) => (
          <Button
            key={o.value}
            variant={sortBy === o.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(o.value)}
          >
            {o.label}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Sort by</Label>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((o) => (
            <Button
              key={o.value}
              variant={sortBy === o.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(o.value)}
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fuel type</Label>
        <div className="flex flex-wrap gap-2">
          {FUEL_OPTIONS.map((o) => (
            <Badge
              key={o.type}
              variant={fuelTypes.includes(o.type) ? 'success' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleFuelType(o.type)}
            >
              {o.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="open-now">Open now only</Label>
        <Switch id="open-now" checked={openNow} onCheckedChange={setOpenNow} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Max distance</Label>
          <span className="text-sm text-muted-foreground">{maxDistance} km</span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full accent-accent"
        />
      </div>
    </div>
  )
}
