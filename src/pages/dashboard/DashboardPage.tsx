import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  Sparkles,
  ArrowRight,
  Clock,
  Truck,
} from 'lucide-react'
import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { StationCard } from '@/components/shared/StationCard'
import { FuelPriceBadge } from '@/components/shared/FuelPriceBadge'
import { NearestStationsSection } from '@/features/stations/NearestStationsSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNearestStations } from '@/hooks/useNearestStations'
import { useDeliveryOrders } from '@/hooks/useDelivery'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useAuthStore } from '@/store/authStore'
import { liveFuelPrices, fuelTrends } from '@/mock/market'
import { ROUTES } from '@/constants/routes'
import { formatPrice, formatQueue, formatDistance } from '@/utils/format'

export default function DashboardPage() {
  const { nearest, isLoading: stationsLoading } = useNearestStations(3)
  const { data: deliveries } = useDeliveryOrders()
  const favoriteIds = useFavoritesStore((s) => s.ids)
  const user = useAuthStore((s) => s.user)

  const closest = nearest[0]
  const cheapestAmongNearest = [...nearest].sort(
    (a, b) =>
      Math.min(...a.prices.map((p) => p.price)) - Math.min(...b.prices.map((p) => p.price)),
  )[0]
  const favorites = nearest.filter((s) => favoriteIds.includes(s.id)).slice(0, 2)

  return (
    <>
      <AppHeader title={`Salom, ${user?.name?.split(' ')[0] ?? 'Haydovchi'}`} />
      <PageTransition className="flex-1 p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {user?.isTaxiMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-fuel-orange/30 bg-fuel-orange/10 px-4 py-3 text-sm"
            >
              <span className="font-medium text-fuel-orange">Taksi rejimi yoqilgan</span>
              <span className="text-muted-foreground"> — Eng arzon yoqilg‘i bildirishnomalari faol</span>
            </motion.div>
          )}

          {/* Eng yaqin zapravkalar — asosiy blok */}
          <NearestStationsSection limit={5} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {liveFuelPrices.map((p) => (
              <FuelPriceBadge key={p.type} {...p} compact />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Yaqin atrofdagi stansiyalar</CardTitle>
                <Link to={ROUTES.map}>
                  <Button variant="ghost" size="sm">
                    Xarita <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {stationsLoading
                    ? null
                    : nearest.map((s) => (
                        <StationCard key={s.id} station={s} />
                      ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="fuel-gradient border-fuel-green/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-fuel-green" />
                    <CardTitle className="text-base">AI tavsiya</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {closest && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Sizga eng yaqin va qulay stansiya — masofa va navbat hisobga olingan.
                      </p>
                      <div className="rounded-lg bg-background/80 p-3">
                        <Badge variant="success" className="mb-2">Eng yaqin</Badge>
                        <p className="font-display font-semibold">{closest.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistance(closest.distanceKm)} · {formatQueue(closest.queueMinutes)}
                        </p>
                        <Badge variant="success" className="mt-2">
                          {closest.prices[0]?.label} — {formatPrice(closest.prices[0]?.price ?? 0)}
                        </Badge>
                      </div>
                      <Link to={ROUTES.station(closest.id)}>
                        <Button className="w-full" size="sm" variant="accent">
                          Ko‘rish
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-fuel-green" />
                    Yaqinlardagi eng arzon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cheapestAmongNearest && (
                    <Link
                      to={ROUTES.station(cheapestAmongNearest.id)}
                      className="block rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <p className="font-medium">{cheapestAmongNearest.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(cheapestAmongNearest.distanceKm)}
                      </p>
                      <p className="text-2xl font-display font-bold text-fuel-green">
                        {formatPrice(Math.min(...cheapestAmongNearest.prices.map((p) => p.price)))}
                      </p>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Yoqilg‘i trendi (7 kun)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-end justify-between gap-1">
                  {fuelTrends.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-fuel-green/80"
                        style={{ height: `${(d.ai95 / 12000) * 100}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  So‘nggi qidiruvlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['AI-95 yaqinimda', 'Green Fuel Hub', '24/7 dizel'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    {q}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Yetkazib berish
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deliveries?.[0] ? (
                  <div className="space-y-2">
                    <Badge variant="warning">{deliveries[0].status.replace('_', ' ')}</Badge>
                    <p className="text-sm font-medium">{deliveries[0].stationName}</p>
                    <p className="text-xs text-muted-foreground">
                      {deliveries[0].liters}L · ~{deliveries[0].estimatedMinutes} daqiqa
                    </p>
                    <Link to={ROUTES.delivery}>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        Kuzatish
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Skeleton className="h-20 w-full" />
                )}
              </CardContent>
            </Card>
          </div>

          {favorites.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-lg font-semibold">Sevimli stansiyalar</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {favorites.map((s) => (
                  <StationCard key={s.id} station={s} variant="horizontal" />
                ))}
              </div>
            </section>
          )}
        </div>
      </PageTransition>
    </>
  )
}
