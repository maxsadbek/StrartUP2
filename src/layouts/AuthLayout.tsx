import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@/components/shared/Logo'
import { ROUTES } from '@/constants/routes'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:block">
        <div className="absolute inset-0 fuel-gradient opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.15),transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo className="text-white [&_span]:text-white [&_span_span]:text-fuel-green" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-4xl font-bold leading-tight">
              Fuel smarter.
              <br />
              Drive further.
            </h2>
            <p className="mt-4 max-w-md text-zinc-400">
              Join 50,000+ drivers who save time and money with live prices, AI recommendations, and on-demand fuel delivery.
            </p>
          </motion.div>
          <p className="text-sm text-zinc-500">© 2026 FuelGo Inc.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mb-8 lg:hidden">
          <Link to={ROUTES.home}>
            <Logo />
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
