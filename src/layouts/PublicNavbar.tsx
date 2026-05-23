import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#prices', label: 'Live Prices' },
  { href: '#taxi', label: 'For Drivers' },
]

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { resolved, toggle } = useThemeStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          scrolled ? 'py-2' : 'py-4',
        )}
      >
        <nav
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6',
            scrolled
              ? 'glass rounded-2xl border border-border/50 px-6 py-3 shadow-lg'
              : 'max-w-7xl',
          )}
        >
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {isAuthenticated ? (
              <Link to={ROUTES.dashboard}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.login} className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to={ROUTES.register}>
                  <Button size="sm" variant="accent">
                    Get started
                  </Button>
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </motion.header>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex items-center justify-between p-4">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-display text-2xl font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link to={ROUTES.login} onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">
                Log in
              </Button>
            </Link>
            <Link to={ROUTES.register} onClick={() => setMobileOpen(false)}>
              <Button variant="accent" className="w-full">
                Get started
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </>
  )
}
