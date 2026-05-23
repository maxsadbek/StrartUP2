import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Fuel } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useStations } from '@/hooks/useStations'
import { ROUTES } from '@/constants/routes'
import { useFiltersStore } from '@/store/filtersStore'
import { formatDistance, formatPrice } from '@/utils/format'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const setSearch = useFiltersStore((s) => s.setSearch)
  const { data: stations = [] } = useStations()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = query
    ? stations.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.address.toLowerCase().includes(query.toLowerCase()),
      )
    : stations.slice(0, 5)

  const go = (path: string) => {
    setOpen(false)
    setQuery('')
    navigate(path)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0 sm:top-[20%] sm:translate-y-0">
        <DialogTitle className="sr-only">Search stations</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations, addresses, fuel types..."
            className="border-0 shadow-none focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No stations found</p>
          ) : (
            filtered.map((s) => {
              const min = s.prices.filter((p) => p.available).sort((a, b) => a.price - b.price)[0]
              return (
                <button
                  key={s.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  onClick={() => {
                    setSearch(s.name)
                    go(ROUTES.station(s.id))
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Fuel className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {s.address} · {formatDistance(s.distance)}
                    </p>
                  </div>
                  {min && (
                    <span className="text-sm font-semibold text-fuel-green">
                      {formatPrice(min.price)}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <button type="button" className="hover:text-foreground" onClick={() => go(ROUTES.map)}>
            Open map →
          </button>
          {' · '}
          <span>Cmd+K to search</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
