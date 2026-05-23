export function formatPrice(value: number, currency = 'UZS') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function formatRating(rating: number) {
  return rating.toFixed(1)
}

export function formatQueue(minutes: number) {
  if (minutes <= 0) return 'No wait'
  if (minutes < 60) return `~${minutes} min`
  return `~${Math.floor(minutes / 60)}h ${minutes % 60}m`
}
