import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { router } from '@/routes'
import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

function ThemeInit() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])

  return null
}

export default function App() {
  return (
    <AppProviders>
      <ThemeInit />
      <RouterProvider router={router} />
    </AppProviders>
  )
}
