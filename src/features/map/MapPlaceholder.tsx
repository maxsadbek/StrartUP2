import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { env } from '@/constants/env'
import { cn } from '@/utils/cn'

interface MapPlaceholderProps {
  className?: string
  showControls?: boolean
  children?: React.ReactNode
}

/** Architecture-ready map shell — swap for Google Maps / Leaflet when API keys are set */
export function MapPlaceholder({ className, showControls = true, children }: MapPlaceholderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900',
        className,
      )}
      role="application"
      aria-label="Fuel station map"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[24px_24px] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
      <div className="absolute inset-0 fuel-gradient opacity-60" />

      {/* Mock pins */}
      {[
        { top: '30%', left: '45%' },
        { top: '55%', left: '62%' },
        { top: '42%', left: '28%' },
        { top: '68%', left: '40%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute z-10"
          style={{ top: pos.top, left: pos.left }}
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
        >
          <div className="relative">
            <div className="absolute -inset-2 animate-ping rounded-full bg-accent/30" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      ))}

      {children}

      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <Button variant="secondary" size="icon" className="glass shadow-md">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="glass shadow-md">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="glass shadow-md">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="accent" size="icon" className="shadow-md">
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="absolute left-4 top-4 z-20 rounded-lg glass px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
        Map: {env.mapProvider === 'google' ? 'Google Maps' : 'OpenStreetMap'} (ready)
      </div>
    </div>
  )
}
