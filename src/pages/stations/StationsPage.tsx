import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { StationCard } from '@/components/shared/StationCard'
import { StationCardSkeleton } from '@/components/shared/StationCardSkeleton'
import { NearestStationsSection } from '@/features/stations/NearestStationsSection'
import { FilterPanel } from '@/features/filters/FilterPanel'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useNearestStations } from '@/hooks/useNearestStations'
import { useFiltersStore } from '@/store/filtersStore'
import { EmptyState } from '@/components/shared/EmptyState'
import { Fuel } from 'lucide-react'

export default function StationsPage() {
  const { search, setSearch } = useFiltersStore()
  const { allSorted, isLoading } = useNearestStations()

  const filtered = search
    ? allSorted.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.address.toLowerCase().includes(search.toLowerCase()),
      )
    : allSorted

  return (
    <>
      <AppHeader title="Barcha zapravkalar" />
      <PageTransition className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <NearestStationsSection limit={4} showMapLink compact />
          <div className="sticky top-20 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zapravka qidirish..."
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
          <p className="mb-4 text-sm text-muted-foreground">
            Masofa bo‘yicha tartiblangan — eng yaqin yuqorida
          </p>
          {!isLoading && filtered.length === 0 ? (
            <EmptyState
              icon={Fuel}
              title="Zapravka topilmadi"
              description="Filtrlarni o‘zgartiring yoki boshqa qidiruv kiriting."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <StationCardSkeleton key={i} />)
                : filtered.map((s, i) => (
                    <div key={s.id} className="relative">
                      {i < 3 && !search && (
                        <span className="absolute -top-2 left-3 z-10 rounded-full bg-fuel-green px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          {i === 0 ? 'Eng yaqin' : `#${i + 1}`}
                        </span>
                      )}
                      <StationCard station={s} />
                    </div>
                  ))}
            </div>
          )}
        </div>
      </PageTransition>
    </>
  )
}
