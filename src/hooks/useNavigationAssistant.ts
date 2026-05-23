import { useCallback, useRef } from 'react'
import { playSelectChime, speakNavigation, stopSpeaking } from '@/utils/voice'
import type { FuelStation } from '@/types/station'
import type { RouteResult } from '@/services/routing.service'

function formatDurationSpeech(seconds: number) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} минут`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h} час ${m} минут` : `${h} час`
}

function formatDistanceSpeech(meters: number) {
  const km = meters / 1000
  if (km < 1) return `${Math.round(meters)} метров`
  return `${km.toFixed(1)} километр${km >= 2 ? 'а' : ''}`
}

export function useNavigationAssistant() {
  const announcedRouteRef = useRef<string | null>(null)

  const announceStationSelected = useCallback((station: FuelStation) => {
    playSelectChime()
    speakNavigation(
      `Вы выбрали заправку ${station.name}. Строю маршрут, подождите секунду.`,
    )
  }, [])

  const announceRouteReady = useCallback(
    (station: FuelStation, route: RouteResult) => {
      const key = `${station.id}-${Math.round(route.durationSeconds)}`
      if (announcedRouteRef.current === key) return
      announcedRouteRef.current = key

      const dist = formatDistanceSpeech(route.distanceMeters)
      const time = formatDurationSpeech(route.durationSeconds)

      speakNavigation(
        `Маршрут готов. До ${station.name}: ${dist}, примерно ${time}. Нажмите «Начать движение», чтобы открыть навигатор.`,
      )
    },
    [],
  )

  const announceNavigationStart = useCallback((station: FuelStation, route?: RouteResult) => {
    const time = route ? formatDurationSpeech(route.durationSeconds) : ''
    speakNavigation(
      `Навигация начата. Едем на ${station.name}${time ? `, в пути около ${time}` : ''}. Хорошей дороги!`,
    )
  }, [])

  const resetAnnouncements = useCallback(() => {
    announcedRouteRef.current = null
    stopSpeaking()
  }, [])

  return {
    announceStationSelected,
    announceRouteReady,
    announceNavigationStart,
    resetAnnouncements,
  }
}
