import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useFiltersStore } from '@/store/filtersStore'
import { FUEL_FILTER_OPTIONS } from '@/constants/fuel'
import { STATION_CITIES } from '@/mock/stations'
import { cn } from '@/utils/cn'

const SORT_OPTIONS = [
  { value: 'distance' as const, label: 'Eng yaqin' },
  { value: 'price' as const, label: 'Arzon' },
  { value: 'rating' as const, label: 'Reyting' },
  { value: 'queue' as const, label: 'Navbat' },
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
    city,
    setCity,
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
          Filtrlar
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          Tozalash
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Viloyat / shahar</Label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="all">Butun O‘zbekiston</option>
          {STATION_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Saralash</Label>
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
        <Label>Yoqilg‘i turi</Label>
        <p className="text-xs text-muted-foreground">Benzin, metan, propan, dizel</p>
        <div className="flex flex-wrap gap-2">
          {FUEL_FILTER_OPTIONS.map((o) => (
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
        <Label htmlFor="open-now">Faqat ochiq</Label>
        <Switch id="open-now" checked={openNow} onCheckedChange={setOpenNow} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Maksimal masofa</Label>
          <span className="text-sm text-muted-foreground">{maxDistance} km</span>
        </div>
        <input
          type="range"
          min={10}
          max={1000}
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full accent-accent"
        />
      </div>
    </div>
  )
}
