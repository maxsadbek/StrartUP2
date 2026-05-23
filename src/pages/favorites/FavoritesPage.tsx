import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { StationCard } from '@/components/shared/StationCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Heart } from 'lucide-react'
import { mockStations } from '@/mock/stations'
import { useFavoritesStore } from '@/store/favoritesStore'
import { ROUTES } from '@/constants/routes'
import { useNavigate } from 'react-router-dom'

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids)
  const stations = mockStations.filter((s) => ids.includes(s.id))
  const navigate = useNavigate()

  return (
    <>
      <AppHeader title="Favorites" />
      <PageTransition className="p-4 lg:p-6">
        <div className="mx-auto max-w-7xl">
          {stations.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Save stations you visit often for quick access."
              actionLabel="Explore stations"
              onAction={() => navigate(ROUTES.stations)}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stations.map((s) => (
                <StationCard key={s.id} station={{ ...s, isFavorite: true }} />
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </>
  )
}
