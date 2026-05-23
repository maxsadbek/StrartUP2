import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { StationCard } from '@/components/shared/StationCard'
import { StationCardSkeleton } from '@/components/shared/StationCardSkeleton'
import { FilterPanel } from '@/features/filters/FilterPanel'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useStations } from '@/hooks/useStations'
import { useFiltersStore } from '@/store/filtersStore'
import { EmptyState } from '@/components/shared/EmptyState'
import { Fuel } from 'lucide-react'

export default function StationsPage() {
  const { search, setSearch } = useFiltersStore()
  const { data: stations, isLoading } = useStations()

  return (
    <>
      <AppHeader title="All stations" />
      <PageTransition className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-20 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stations..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <FilterPanel />
            </div>
          </div>
        </aside>
        <div className="flex-1">
          {!isLoading && stations?.length === 0 ? (
            <EmptyState
              icon={Fuel}
              title="No stations found"
              description="Try adjusting your filters or search query."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <StationCardSkeleton key={i} />)
                : stations?.map((s) => <StationCard key={s.id} station={s} />)}
            </div>
          )}
        </div>
      </PageTransition>
    </>
  )
}
