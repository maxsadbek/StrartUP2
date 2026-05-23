import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  Navigation,
  Star,
  Clock,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { useStation, useStationReviews } from '@/hooks/useStations'
import { useFavoritesStore } from '@/store/favoritesStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ROUTES } from '@/constants/routes'
import { formatDistance, formatPrice, formatQueue, formatRating } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function StationDetailPage() {
  const { id = '' } = useParams()
  const { data: station, isLoading } = useStation(id)
  const { data: reviews } = useStationReviews(id)
  const { isFavorite, toggle } = useFavoritesStore()
  const fav = isFavorite(id)

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <div className="space-y-4 p-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </>
    )
  }

  if (!station) {
    return (
      <div className="p-8 text-center">
        <p>Station not found</p>
        <Link to={ROUTES.stations}>
          <Button variant="outline" className="mt-4">
            Back to stations
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <AppHeader title={station.name} />
      <PageTransition className="pb-8">
        <div className="relative h-56 sm:h-72 lg:h-80">
          <img src={station.images[0]} alt={station.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          <Link
            to={ROUTES.stations}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full glass"
            onClick={() => toggle(station.id)}
          >
            <Heart className={cn('h-5 w-5', fav && 'fill-fuel-orange text-fuel-orange')} />
          </Button>
        </div>

        <div className="mx-auto max-w-4xl space-y-6 px-4 -mt-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant="muted" className="mb-2">{station.brand}</Badge>
                <h1 className="font-display text-2xl font-bold sm:text-3xl">{station.name}</h1>
                <p className="text-muted-foreground">{station.address}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-fuel-orange text-fuel-orange" />
                    {formatRating(station.rating)} ({station.reviewCount})
                  </span>
                  <span>{formatDistance(station.distance)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatQueue(station.queueMinutes)}
                  </span>
                  <Badge variant={station.isOpen ? 'success' : 'muted'}>
                    {station.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`,
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                >
                  <Navigation className="h-4 w-4" />
                  Navigatsiya
                </Button>
                <Link to={ROUTES.delivery}>
                  <Button variant="accent">
                    <Truck className="h-4 w-4" />
                    Delivery
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {station.prices.map((p) => (
              <Card key={p.type} className={!p.available ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{p.label}</p>
                  <p className="font-display text-2xl font-bold">{formatPrice(p.price)}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {p.available ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-fuel-green" />
                        <span className="text-fuel-green">Available</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Unavailable</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Services</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {station.services.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Live availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current queue</span>
                    <span className="font-semibold">{formatQueue(station.queueMinutes)}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-fuel-green transition-all"
                      style={{ width: `${Math.max(10, 100 - station.queueMinutes * 5)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              {reviews?.length ? (
                reviews.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="flex gap-3 p-4">
                      <Avatar>
                        <AvatarFallback>{r.author.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{r.author}</span>
                          <div className="flex">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-fuel-orange text-fuel-orange" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </TabsContent>
            <TabsContent value="gallery">
              <div className="grid gap-2 sm:grid-cols-3">
                {station.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="aspect-video rounded-lg object-cover" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </>
  )
}
