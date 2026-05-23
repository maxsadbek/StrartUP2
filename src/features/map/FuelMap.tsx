import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet'
import { StationClusterLayer } from './StationClusterLayer'
import { LocateFixed } from 'lucide-react'
import L from 'leaflet'
import type { FuelStation } from '@/types/station'
import type { LatLng } from '@/store/locationStore'
import type { RouteResult } from '@/services/routing.service'
import { UZBEKISTAN_MAP_BOUNDS } from '@/constants/uzbekistan'
import { cn } from '@/utils/cn'
import 'leaflet/dist/leaflet.css'

const userIcon = L.divIcon({
  className: 'fuel-marker-wrapper',
  html: `
    <div class="user-marker">
      <div class="user-marker__pulse"></div>
      <div class="user-marker__dot"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function MapController({
  selectedStation,
  route,
  allStations,
}: {
  selectedStation: FuelStation | null
  route: RouteResult | undefined
  allStations: FuelStation[]
}) {
  const map = useMap()
  const prevRef = useRef<string>('')
  const initialFit = useRef(false)

  useEffect(() => {
    if (!initialFit.current && allStations.length > 0) {
      initialFit.current = true
      if (allStations.length > 8) {
        map.fitBounds(UZBEKISTAN_MAP_BOUNDS, { padding: [24, 24], maxZoom: 7 })
      } else {
        const points: [number, number][] = allStations.map(
          (s) => [s.lat, s.lng] as [number, number],
        )
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 11 })
      }
    }
  }, [map, allStations])

  useEffect(() => {
    const key = `${selectedStation?.id ?? ''}-${route?.coordinates.length ?? 0}`
    if (key === prevRef.current) return
    prevRef.current = key

    if (route && route.coordinates.length > 1) {
      map.fitBounds(L.latLngBounds(route.coordinates), { padding: [60, 60], maxZoom: 15 })
    } else if (selectedStation) {
      map.flyTo([selectedStation.lat, selectedStation.lng], 15, { duration: 0.8 })
    }
  }, [map, selectedStation, route])

  return null
}

function MapViewControls({
  position,
  onRecenter,
}: {
  position: LatLng
  onRecenter: () => void
}) {
  const map = useMap()
  return (
    <div className="absolute bottom-24 right-3 z-[1000] flex flex-col gap-2 lg:bottom-6">
      <button
        type="button"
        className="leaflet-recenter-btn !relative !bottom-auto !right-auto"
        onClick={() => map.fitBounds(UZBEKISTAN_MAP_BOUNDS, { padding: [24, 24], maxZoom: 7 })}
        title="Butun O‘zbekiston"
      >
        <span className="text-[10px] font-bold">UZ</span>
      </button>
      <button
        type="button"
        className="leaflet-recenter-btn !relative !bottom-auto !right-auto"
        onClick={() => {
          onRecenter()
          map.flyTo([position.lat, position.lng], 12, { duration: 0.6 })
        }}
        title="Mening joylashuvim"
      >
        <LocateFixed className="h-5 w-5" />
      </button>
    </div>
  )
}

interface FuelMapProps {
  stations: FuelStation[]
  userPosition: LatLng
  selectedStationId: string | null
  nearestIds: Set<string>
  route?: RouteResult
  onSelectStation: (id: string) => void
  onRecenter: () => void
  className?: string
}

export function FuelMap({
  stations,
  userPosition,
  selectedStationId,
  nearestIds,
  route,
  onSelectStation,
  onRecenter,
  className,
}: FuelMapProps) {
  const selectedStation = useMemo(
    () => stations.find((s) => s.id === selectedStationId) ?? null,
    [stations, selectedStationId],
  )

  const center: [number, number] = [userPosition.lat, userPosition.lng]

  return (
    <div className={cn('relative h-full w-full', className)}>
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full z-0"
        zoomControl={false}
        attributionControl={true}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        <Marker position={center} icon={userIcon} zIndexOffset={1000} />

        <StationClusterLayer
          stations={stations}
          selectedStationId={selectedStationId}
          nearestIds={nearestIds}
          onSelectStation={onSelectStation}
        />

        {route && route.coordinates.length > 1 && (
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: '#22c55e',
              weight: 5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        <MapController selectedStation={selectedStation} route={route} allStations={stations} />
        <MapViewControls position={userPosition} onRecenter={onRecenter} />
      </MapContainer>
    </div>
  )
}
