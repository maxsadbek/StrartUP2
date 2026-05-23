import type { FuelType } from '@/types/station'

export const FUEL_LABELS: Record<FuelType, string> = {
  ai92: 'AI-92 (Benzin)',
  ai95: 'AI-95 (Benzin)',
  ai98: 'AI-98 (Benzin)',
  diesel: 'Dizel',
  metan: 'Metan (CNG)',
  propan: 'Propan (LPG)',
}

export const FUEL_FILTER_OPTIONS: { type: FuelType; label: string }[] = [
  { type: 'ai92', label: 'AI-92' },
  { type: 'ai95', label: 'AI-95' },
  { type: 'ai98', label: 'AI-98' },
  { type: 'diesel', label: 'Dizel' },
  { type: 'metan', label: 'Metan' },
  { type: 'propan', label: 'Propan' },
]

/** Marker ranglari xaritada */
export const FUEL_MARKER_COLORS: Record<string, string> = {
  benzin: '#18181b',
  diesel: '#f59e0b',
  metan: '#3b82f6',
  propan: '#8b5cf6',
  mixed: '#22c55e',
}

export function getStationMarkerCategory(
  prices: { type: FuelType; available: boolean }[],
): keyof typeof FUEL_MARKER_COLORS {
  const available = prices.filter((p) => p.available).map((p) => p.type)
  const hasBenzin = available.some((t) => t === 'ai92' || t === 'ai95' || t === 'ai98')
  const hasMetan = available.includes('metan')
  const hasPropan = available.includes('propan')
  const hasDiesel = available.includes('diesel')

  if (hasMetan && !hasBenzin && !hasPropan) return 'metan'
  if (hasPropan && !hasBenzin && !hasMetan) return 'propan'
  if (hasDiesel && !hasBenzin && !hasMetan && !hasPropan) return 'diesel'
  if (hasBenzin && !hasMetan && !hasPropan) return 'benzin'
  return 'mixed'
}
