import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Moon, Sun, Bell, Car, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme, resolved } = useThemeStore()
  const setTaxiMode = useAuthStore((s) => s.setTaxiMode)
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <AppHeader title="Settings" />
      <PageTransition className="p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {resolved === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark mode</Label>
                <Switch
                  checked={resolved === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                      theme === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Car className="h-4 w-4" />
                Driver preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Taxi driver mode</Label>
                  <p className="text-xs text-muted-foreground">Priority lanes & fuel alerts</p>
                </div>
                <Switch
                  checked={user?.isTaxiMode ?? false}
                  onCheckedChange={setTaxiMode}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Price alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Notify when prices drop nearby</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Privacy & security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">
                Change password
              </button>
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">
                Two-factor authentication
              </button>
              <button type="button" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">
                Download my data
              </button>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </>
  )
}
