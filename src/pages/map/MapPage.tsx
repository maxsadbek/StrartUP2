import { useState } from 'react'
import { Search } from 'lucide-react'
import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { MapPlaceholder } from '@/features/map/MapPlaceholder'
import { FilterPanel } from '@/features/filters/FilterPanel'
import { StationCard } from '@/components/shared/StationCard'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useStations } from '@/hooks/useStations'
import { useFiltersStore } from '@/store/filtersStore'
import { StationCardSkeleton } from '@/components/shared/StationCardSkeleton'
import { formatPrice } from '@/utils/format'

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(false)
  const { search, setSearch } = useFiltersStore()
  const { data: stations, isLoading } = useStations()

  return (
    <>
      <AppHeader title="Station map" />
      <PageTransition className="flex flex-1 flex-col lg:flex-row">
        <aside className="hidden w-96 shrink-0 flex-col border-r border-border lg:flex">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stations..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <FilterPanel collapsed />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-3 p-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <StationCardSkeleton key={i} />)
                : stations?.map((s) => (
                    <StationCard key={s.id} station={s} variant="horizontal" />
                  ))}
            </div>
          </ScrollArea>
        </aside>

        <div className="relative flex-1 p-4 lg:p-0">
          <MapPlaceholder className="h-[calc(100vh-8rem)] min-h-[400px] lg:h-[calc(100vh-3.5rem)] lg:rounded-none">
            <div className="absolute left-4 right-4 top-4 z-20 lg:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="glass pl-9 shadow-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Card className="absolute bottom-24 left-4 right-4 z-20 glass p-4 shadow-xl lg:bottom-8 lg:left-auto lg:right-8 lg:w-80">
              <p className="text-xs font-medium text-muted-foreground">Route preview</p>
              <p className="font-display font-semibold">To Green Fuel Hub</p>
              <p className="text-sm text-muted-foreground">4.2 km · ~8 min · AI-95 from 11,200 UZS</p>
            </Card>
          </MapPlaceholder>

          <button
            type="button"
            className="absolute bottom-20 right-4 z-30 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </button>

          {showFilters && (
            <div className="absolute inset-x-0 bottom-16 z-30 max-h-[50vh] overflow-y-auto rounded-t-2xl border border-border bg-background p-4 lg:hidden">
              <FilterPanel />
            </div>
          )}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-4 lg:hidden">
            {stations?.slice(0, 4).map((s) => {
              const min = s.prices.filter((p) => p.available).sort((a, b) => a.price - b.price)[0]
              return (
                <Card key={s.id} className="min-w-[200px] shrink-0 p-3">
                  <p className="truncate font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.distance} km</p>
                  {min && <p className="text-sm font-semibold text-fuel-green">{formatPrice(min.price)}</p>}
                </Card>
              )
            })}
          </div>
        </div>
      </PageTransition>
    </>
  )
}
