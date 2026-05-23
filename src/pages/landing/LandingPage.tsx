import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingDown,
  Truck,
  Shield,
  Zap,
  Car,
  Star,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FuelPriceBadge } from '@/components/shared/FuelPriceBadge'
import { MapPlaceholder } from '@/features/map/MapPlaceholder'
import { ROUTES } from '@/constants/routes'
import { liveFuelPrices, testimonials } from '@/mock/market'
import { mockStations } from '@/mock/stations'
import { formatPrice, formatDistance } from '@/utils/format'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const features = [
  { icon: MapPin, title: 'Live station map', desc: 'Real-time prices, queues, and availability on an interactive map.' },
  { icon: Sparkles, title: 'AI fuel advisor', desc: 'Personalized recommendations based on your route, vehicle, and habits.' },
  { icon: TrendingDown, title: 'Price intelligence', desc: 'Track trends and get alerts when fuel drops near you.' },
  { icon: Truck, title: 'On-demand delivery', desc: 'Fuel delivered to your location — fleet-ready logistics.' },
  { icon: Shield, title: 'Trusted reviews', desc: 'Verified driver ratings and transparent station data.' },
  { icon: Zap, title: 'Instant search', desc: 'Command palette search across stations, addresses, and fuel types.' },
]

export default function LandingPage() {
  const cheapest = [...mockStations].sort(
    (a, b) => Math.min(...a.prices.map((p) => p.price)) - Math.min(...b.prices.map((p) => p.price)),
  )[0]

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 lg:pb-32 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 fuel-gradient" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-fuel-green/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-fuel-orange/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 gap-1">
              <Sparkles className="h-3 w-3 text-fuel-green" />
              AI-powered fuel discovery
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Find fuel.
              <br />
              <span className="text-gradient">Save every mile.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              FuelGo is the modern platform for drivers, commuters, and taxi fleets — live prices, smart routes, and fuel delivery in one premium experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={ROUTES.register}>
                <Button size="lg" variant="accent" className="gap-2 shadow-lg">
                  Start free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={ROUTES.login}>
                <Button size="lg" variant="outline">
                  View demo
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <p className="font-display text-2xl font-bold text-foreground">50K+</p>
                <p>Active drivers</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-bold text-foreground">4.9</p>
                <p className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-fuel-orange text-fuel-orange" />
                  App rating
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-fuel-green/20 to-fuel-orange/10 blur-2xl" />
            <MapPlaceholder className="relative h-[320px] shadow-2xl sm:h-[400px] lg:h-[440px]" />
            <Card className="absolute -bottom-4 -left-4 z-10 w-48 glass shadow-xl sm:-left-8">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">Nearest cheap</p>
                <p className="font-display font-semibold">{cheapest?.name}</p>
                <p className="text-lg font-bold text-fuel-green">
                  {cheapest && formatPrice(Math.min(...cheapest.prices.map((p) => p.price)))}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Live prices */}
      <section id="prices" className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold">Live fuel prices</h2>
            <p className="mt-2 text-muted-foreground">Updated every minute across Tashkent</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {liveFuelPrices.map((p) => (
              <FuelPriceBadge key={p.type} {...p} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Built for modern drivers</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Enterprise-grade tools wrapped in a consumer experience you will actually enjoy using.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <motion.div key={f.title} whileHover={{ y: -4 }} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* AI + cheapest demo */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <Badge variant="success" className="mb-4">AI Recommendation</Badge>
            <h2 className="font-display text-3xl font-bold">Your personal fuel strategist</h2>
            <p className="mt-4 text-muted-foreground">
              FuelGo analyzes traffic, queue times, price history, and your vehicle to recommend the optimal station — not just the cheapest pin on the map.
            </p>
            <ul className="mt-6 space-y-3">
              {['Route-aware suggestions', 'Taxi & fleet optimizations', 'Price drop predictions'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="h-4 w-4 text-fuel-green" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp}>
            <Card className="overflow-hidden border-fuel-green/20 fuel-gradient">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-fuel-green">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">Recommended now</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold">{cheapest?.name}</h3>
                <p className="text-muted-foreground">{cheapest?.address}</p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI-95</p>
                    <p className="font-display text-3xl font-bold text-fuel-green">
                      {cheapest && formatPrice(cheapest.prices[1]?.price ?? 0)}
                    </p>
                  </div>
                  <Badge>{cheapest && formatDistance(cheapest.distance)} away</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Taxi */}
      <section id="taxi" className="border-y border-border bg-zinc-950 px-4 py-24 text-white sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-4 bg-fuel-orange/20 text-fuel-orange border-0">Taxi Driver Mode</Badge>
              <h2 className="font-display text-3xl font-bold">Built for professionals who drive for a living</h2>
              <p className="mt-4 text-zinc-400">
                Priority lane indicators, shift-based fuel alerts, fleet dashboards, and earnings-aware fuel budgeting.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Priority queue lanes', 'Shift fuel budgets', 'Fleet analytics', 'Instant expense export'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-fuel-orange" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-zinc-800 bg-zinc-900">
              <CardContent className="p-6">
                <p className="text-sm text-zinc-400">Today&apos;s savings</p>
                <p className="font-display text-4xl font-bold text-fuel-green">127,400 UZS</p>
                <p className="mt-2 text-sm text-zinc-500">vs. average station prices in your zone</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-3/4 rounded-full bg-fuel-green" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* App mockup */}
      <section className="px-4 py-24 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-3xl font-bold">Designed for every screen</h2>
          <p className="mt-2 text-muted-foreground">Dashboard, map, and delivery — pixel-perfect on mobile and desktop</p>
          <div className="mt-12 flex justify-center gap-4 overflow-hidden">
            {['Dashboard', 'Map', 'Delivery'].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="w-48 shrink-0 sm:w-56"
              >
                <div className="rounded-[2rem] border-4 border-zinc-800 bg-zinc-900 p-2 shadow-2xl dark:border-zinc-700">
                  <div className="aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-muted">
                    <div className="flex h-8 items-center justify-center border-b border-border bg-card text-[10px] font-medium">
                      {label}
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="h-16 rounded-lg bg-fuel-green/20" />
                      <div className="h-8 rounded bg-muted" />
                      <div className="h-8 rounded bg-muted" />
                      <div className="h-20 rounded-lg bg-muted" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 px-4 py-24 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold">Trusted by drivers</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-fuel-orange text-fuel-orange" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-4xl rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to fuel smarter?</h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Join thousands of drivers saving time and money. Free to start — no credit card required.
          </p>
          <Link to={ROUTES.register} className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="gap-2">
              Get started free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-display font-bold">
            Fuel<span className="text-accent">Go</span>
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#prices" className="hover:text-foreground">Prices</a>
            <Link to={ROUTES.login} className="hover:text-foreground">Sign in</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 FuelGo Inc.</p>
        </div>
      </footer>
    </main>
  )
}
