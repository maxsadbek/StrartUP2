import { Fuel } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link to={ROUTES.home} className={cn('flex items-center gap-2', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Fuel className="h-5 w-5" />
      </div>
      {showText && (
        <span className="font-display text-xl font-bold tracking-tight">
          Fuel<span className="text-accent">Go</span>
        </span>
      )}
    </Link>
  )
}
