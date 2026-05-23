# FuelGo

Premium fuel station discovery platform — React + TypeScript frontend with production-ready architecture.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn-style UI components
- Framer Motion · React Router · TanStack Query · Zustand
- Axios · React Hook Form · Zod · Lucide Icons · Sonner toasts

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo auth:** any email + password (6+ characters) on `/login` or `/register`.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login`, `/register` | Authentication |
| `/dashboard` | Analytics dashboard |
| `/map` | Station map (OSM/Google-ready shell) |
| `/stations` | Station list + filters |
| `/station/:id` | Station details |
| `/favorites` | Saved stations |
| `/delivery` | Fuel delivery flow |
| `/profile`, `/settings` | User account |
| `/notifications` | Alerts |

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_BASE_URL=/api
VITE_MAP_PROVIDER=osm
VITE_GOOGLE_MAPS_KEY=
VITE_ENABLE_MOCK_API=true
```

## Architecture

```
src/
  app/          # Providers (Query, theme, toasts)
  pages/        # Route pages
  layouts/      # Public, app, auth layouts
  components/   # Shared + ui primitives
  features/     # Map, filters, search
  services/     # API client, interceptors, services
  hooks/        # TanStack Query hooks
  store/        # Zustand (auth, theme, favorites, filters)
  routes/       # Router config
  types/        # TypeScript models
  mock/         # Realistic mock data
  constants/    # Routes, env
  utils/        # cn, formatters
```

## Map integration

Replace `MapPlaceholder` with Google Maps or Leaflet when keys are configured via `VITE_MAP_PROVIDER` and `VITE_GOOGLE_MAPS_KEY`.

## Build

```bash
npm run build
npm run preview
```
