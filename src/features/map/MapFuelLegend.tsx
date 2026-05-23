import { FUEL_MARKER_COLORS } from '@/constants/fuel'

const items = [
  { key: 'benzin', label: 'Benzin (AI-92/95/98)' },
  { key: 'metan', label: 'Metan (CNG)' },
  { key: 'propan', label: 'Propan (LPG)' },
  { key: 'diesel', label: 'Dizel' },
  { key: 'mixed', label: 'Aralash' },
]

export function MapFuelLegend() {
  return (
    <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-md">
      <p className="mb-2 text-xs font-semibold">Yoqilg‘i turlari</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2 text-[11px]">
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-white shadow-sm"
              style={{ background: FUEL_MARKER_COLORS[item.key] }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
