import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'

interface FuelPriceBadgeProps {
  label: string
  price: number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  compact?: boolean
}

export function FuelPriceBadge({ label, price, change, trend = 'stable', compact }: FuelPriceBadgeProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md',
        compact && 'p-2',
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={cn('font-display font-bold', compact ? 'text-base' : 'text-lg')}>
        {formatPrice(price)}
      </span>
      {change !== undefined && (
        <Badge
          variant={trend === 'down' ? 'success' : trend === 'up' ? 'warning' : 'muted'}
          className="w-fit gap-1"
        >
          <TrendIcon className="h-3 w-3" />
          {Math.abs(change)}%
        </Badge>
      )}
    </div>
  )
}
