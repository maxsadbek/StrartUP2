export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  mapProvider: (import.meta.env.VITE_MAP_PROVIDER ?? 'osm') as 'google' | 'osm',
  googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_KEY ?? '',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API !== 'false',
  /** OpenStreetMap dan haqiqiy zapravkalar */
  useOsmStations: import.meta.env.VITE_USE_OSM_STATIONS !== 'false',
} as const
