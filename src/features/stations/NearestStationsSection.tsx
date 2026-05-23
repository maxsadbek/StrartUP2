import { Link, useNavigate } from 'react-router-dom'
import { MapPinned, Loader2, Navigation, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapStationListItem } from '@/features/map/MapStationListItem'
import { StationCardSkeleton } from '@/components/shared/StationCardSkeleton'
import { useNearestStations } from '@/hooks/useNearestStations'
import { useMapStore } from '@/store/mapStore'
import { ROUTES } from '@/constants/routes'

interface NearestStationsSectionProps {
  limit?: number
  showMapLink?: boolean
  onSelectStation?: (id: string) => void
  selectedId?: string | null
  compact?: boolean
}

export function NearestStationsSection({
  limit = 5,
  showMapLink = true,
  onSelectStation,
  selectedId,
  compact = false,
}: NearestStationsSectionProps) {
  const { nearest, isLoading, isGps, locationError } = useNearestStations(limit)
  const selectOnMap = useMapStore((s) => s.selectStation)
  const navigate = useNavigate()

  const handleSelect = (id: string) => {
    if (onSelectStation) {
      onSelectStation(id)
      return
    }
    selectOnMap(id)
    navigate(ROUTES.map)
  }

  return (
    <Card className="border-fuel-green/20">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuel-green/15">
            <MapPinned className="h-5 w-5 text-fuel-green" />
          </div>
          <div>
            <CardTitle className="text-base">Sizga eng yaqin zapravkalar</CardTitle>
            <p className="text-xs text-muted-foreground">
              {isGps ? 'Butun O‘zbekiston bo‘yicha' : 'O‘zbekiston markazi bo‘yicha'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Badge variant={isGps ? 'success' : 'outline'} className="shrink-0">
              {isGps ? 'GPS' : 'Demo'}
            </Badge>
          )}
          {showMapLink && (
            <Link to={ROUTES.map}>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Xarita <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {locationError && !isGps && (
          <p className="mb-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {locationError}. Brauzerda joylashuv ruxsatini yoqing.
          </p>
        )}

        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <StationCardSkeleton key={i} />)
          : nearest.map((s, i) =>
              compact ? (
                <MapStationListItem
                  key={s.id}
                  station={s}
                  distanceKm={s.distanceKm}
                  selected={selectedId === s.id}
                  rank={i + 1}
                  onClick={() => handleSelect(s.id)}
                />
              ) : (
                <MapStationListItem
                  key={s.id}
                  station={s}
                  distanceKm={s.distanceKm}
                  selected={selectedId === s.id}
                  rank={i + 1}
                  onClick={() => handleSelect(s.id)}
                />
              ),
            )}

        {showMapLink && (
          <Link to={ROUTES.map} className="block pt-2 sm:hidden">
            <Button variant="outline" className="w-full gap-2">
              <Navigation className="h-4 w-4" />
              Xaritada ko‘rish
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
