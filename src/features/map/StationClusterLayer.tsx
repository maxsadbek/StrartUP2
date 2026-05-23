import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { FuelStation } from '@/types/station'
import { getStationMarkerCategory, FUEL_MARKER_COLORS } from '@/constants/fuel'

function createStationIcon(selected: boolean, isNearest: boolean, category: string) {
  const color = FUEL_MARKER_COLORS[category] ?? FUEL_MARKER_COLORS.mixed
  return L.divIcon({
    className: 'fuel-marker-wrapper',
    html: `
      <div class="fuel-marker ${selected ? 'fuel-marker--selected' : ''} ${isNearest ? 'fuel-marker--nearest' : ''}"
           style="background: ${selected ? '#22c55e' : color}">
        <span style="color:white;font-size:12px;font-weight:700">⛽</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
}

interface StationClusterLayerProps {
  stations: FuelStation[]
  selectedStationId: string | null
  nearestIds: Set<string>
  onSelectStation: (id: string) => void
}

export function StationClusterLayer({
  stations,
  selectedStationId,
  nearestIds,
  onSelectStation,
}: StationClusterLayerProps) {
  const map = useMap()
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    if (!clusterRef.current) {
      clusterRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        maxClusterRadius: 45,
        disableClusteringAtZoom: 16,
      })
      map.addLayer(clusterRef.current)
    }

    const cluster = clusterRef.current
    cluster.clearLayers()

    stations.forEach((station) => {
      const category = getStationMarkerCategory(station.prices)
      const marker = L.marker([station.lat, station.lng], {
        icon: createStationIcon(
          station.id === selectedStationId,
          nearestIds.has(station.id),
          category,
        ),
      })
      marker.on('click', () => onSelectStation(station.id))
      cluster.addLayer(marker)
    })

    return () => {
      cluster.clearLayers()
    }
  }, [map, stations, selectedStationId, nearestIds, onSelectStation])

  useEffect(() => {
    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
        clusterRef.current = null
      }
    }
  }, [map])

  return null
}
