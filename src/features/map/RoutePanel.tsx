import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Navigation,
  Clock,
  Route,
  X,
  ExternalLink,
  Fuel,
  MapPin,
  Play,
  Volume2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { formatPrice, formatQueue } from '@/utils/format'
import type { FuelStation } from '@/types/station'
import type { RouteResult } from '@/services/routing.service'
import { useNavigationAssistant } from '@/hooks/useNavigationAssistant'

interface RoutePanelProps {
  station: FuelStation
  route: RouteResult | undefined
  routeLoading: boolean
  distanceKm: number
  onClose: () => void
}

function formatDuration(seconds: number) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} daqiqa`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h} soat ${m} daq` : `${h} soat`
}

function formatRouteDistance(meters: number) {
  const km = meters / 1000
  return km < 1 ? `${Math.round(meters)} m` : `${km.toFixed(1)} km`
}

export function RoutePanel({
  station,
  route,
  routeLoading,
  distanceKm,
  onClose,
}: RoutePanelProps) {
  const [navStarted, setNavStarted] = useState(false)
  const { announceRouteReady, announceNavigationStart } = useNavigationAssistant()

  const cheapest = station.prices
    .filter((p) => p.available)
    .sort((a, b) => a.price - b.price)[0]

  const routeReady = !routeLoading && !!route

  useEffect(() => {
    if (routeReady && route) {
      announceRouteReady(station, route)
    }
  }, [routeReady, route, station, announceRouteReady])

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const openYandexMaps = () => {
    window.open(
      `https://yandex.ru/maps/?rtext=~${station.lat},${station.lng}&rtt=auto`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleStartNavigation = () => {
    setNavStarted(true)
    announceNavigationStart(station, route)
    openYandexMaps()
  }

  const handleClose = () => {
    setNavStarted(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="absolute bottom-4 left-4 right-4 z-[1000] mx-auto max-w-md lg:left-auto lg:right-6 lg:bottom-6"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="success">Yo&apos;nalish</Badge>
              {routeReady && (
                <Badge variant="outline" className="gap-1 text-[10px]">
                  <Volume2 className="h-3 w-3" />
                  Ovozli
                </Badge>
              )}
            </div>
            <h3 className="truncate font-display text-lg font-semibold">{station.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{station.address}</p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Yo'l vizualizatsiyasi */}
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
              <span>Siz</span>
            </div>
            <div className="relative flex-1">
              <div className="h-0.5 w-full bg-linear-to-r from-blue-500 via-fuel-green to-fuel-orange" />
              {routeReady && route && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute -top-3 left-0 text-center text-[10px] font-medium text-fuel-green"
                >
                  {formatRouteDistance(route.distanceMeters)} · {formatDuration(route.durationSeconds)}
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-fuel-orange ring-4 ring-fuel-orange/20" />
              <span className="max-w-[60px] truncate">Zapravka</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-border">
          <div className="bg-background p-3 text-center">
            <Route className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Masofa</p>
            {routeLoading ? (
              <Skeleton className="mx-auto mt-1 h-5 w-12" />
            ) : (
              <p className="font-display font-bold">
                {route ? formatRouteDistance(route.distanceMeters) : `${distanceKm.toFixed(1)} km`}
              </p>
            )}
          </div>
          <div className="bg-background p-3 text-center">
            <Clock className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Vaqt</p>
            {routeLoading ? (
              <Skeleton className="mx-auto mt-1 h-5 w-14" />
            ) : (
              <p className="font-display font-bold text-fuel-green">
                {route ? formatDuration(route.durationSeconds) : '—'}
              </p>
            )}
          </div>
          <div className="bg-background p-3 text-center">
            <Fuel className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Navbat</p>
            <p className="font-display text-sm font-bold">{formatQueue(station.queueMinutes)}</p>
          </div>
        </div>

        {cheapest && (
          <div className="border-t border-border px-4 py-2 text-sm">
            <span className="text-muted-foreground">{cheapest.label}: </span>
            <span className="font-semibold text-fuel-green">{formatPrice(cheapest.price)}</span>
          </div>
        )}

        {/* Yo'lga chiqish — asosiy blok */}
        <div className="space-y-3 p-4">
          <AnimatePresence mode="wait">
            {routeLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-muted py-4 text-sm text-muted-foreground"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Route className="h-5 w-5" />
                </motion.div>
                Yo&apos;l hisoblanmoqda...
              </motion.div>
            ) : (
              <motion.div key="ready" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  className={`rounded-xl border-2 p-4 transition-colors ${
                    navStarted
                      ? 'border-fuel-green bg-fuel-green/10'
                      : 'border-fuel-green/50 bg-linear-to-br from-fuel-green/15 to-transparent'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuel-green text-white shadow-lg shadow-fuel-green/30">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="font-display font-semibold">Yo&apos;lga chiqish</p>
                      <p className="text-xs text-muted-foreground">
                        Navigator ochiladi + ovozli ko&apos;rsatma
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    variant="accent"
                    className="w-full gap-2 text-base shadow-lg"
                    onClick={handleStartNavigation}
                    disabled={!routeReady}
                  >
                    <Navigation className="h-5 w-5" />
                    {navStarted ? 'Navigator ochilgan' : 'Yo\'lga chiqish'}
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={openYandexMaps}>
                    <MapPin className="h-4 w-4" />
                    Yandex
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={openGoogleMaps}>
                    <Navigation className="h-4 w-4" />
                    Google
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Link to={ROUTES.station(station.id)}>
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              Zapravka haqida batafsil
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
