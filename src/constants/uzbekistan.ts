/** O‘zbekiston geografik chegaralari (taxminiy) */
export const UZBEKISTAN_BOUNDS = {
  south: 37.0,
  west: 55.9,
  north: 45.65,
  east: 73.25,
} as const

/** Mamlakat markazi — GPS yo‘q bo‘lsa default */
export const UZBEKISTAN_CENTER = { lat: 41.95, lng: 64.15 } as const

/** Leaflet fitBounds: [janubiy-g‘arb, shimoliy-sharq] */
export const UZBEKISTAN_MAP_BOUNDS: [[number, number], [number, number]] = [
  [UZBEKISTAN_BOUNDS.south, UZBEKISTAN_BOUNDS.west],
  [UZBEKISTAN_BOUNDS.north, UZBEKISTAN_BOUNDS.east],
]

export const UZBEKISTAN_CITIES = [
  { id: 'all', name: 'Butun O‘zbekiston', lat: 41.95, lng: 64.15 },
  { id: 'toshkent', name: 'Toshkent', lat: 41.2995, lng: 69.2401 },
  { id: 'samarqand', name: 'Samarqand', lat: 39.6542, lng: 66.9597 },
  { id: 'buxoro', name: 'Buxoro', lat: 39.7747, lng: 64.4286 },
  { id: 'fargona', name: 'Farg‘ona', lat: 40.3864, lng: 71.7864 },
  { id: 'andijon', name: 'Andijon', lat: 40.7821, lng: 72.3442 },
  { id: 'namangan', name: 'Namangan', lat: 40.9983, lng: 71.6726 },
  { id: 'qarshi', name: 'Qarshi', lat: 38.8606, lng: 65.7985 },
  { id: 'termiz', name: 'Termiz', lat: 37.2242, lng: 67.2783 },
  { id: 'navoiy', name: 'Navoiy', lat: 40.0844, lng: 65.3792 },
  { id: 'jizzax', name: 'Jizzax', lat: 40.1158, lng: 67.8422 },
  { id: 'nukus', name: 'Nukus', lat: 42.4611, lng: 59.6003 },
  { id: 'urganch', name: 'Urganch', lat: 41.5503, lng: 60.6335 },
  { id: 'xiva', name: 'Xiva', lat: 41.3783, lng: 60.3639 },
  { id: 'guliston', name: 'Guliston', lat: 40.4897, lng: 68.7842 },
  { id: 'nurafshon', name: 'Nurafshon', lat: 41.0426, lng: 73.0156 },
] as const
