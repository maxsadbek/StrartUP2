import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Car, Mail, Phone, Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.home)
  }

  return (
    <>
      <AppHeader title="Profile" />
      <PageTransition className="p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {user?.name?.slice(0, 2).toUpperCase() ?? 'FG'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold">{user?.name}</h2>
                <Badge variant="outline" className="mt-1 capitalize">{user?.role} account</Badge>
                {user?.isTaxiMode && (
                  <Badge variant="warning" className="ml-2">Taxi mode</Badge>
                )}
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2 sm:justify-start">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="flex items-center justify-center gap-2 sm:justify-start">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </p>
                  )}
                  {user?.vehiclePlate && (
                    <p className="flex items-center justify-center gap-2 sm:justify-start">
                      <Car className="h-4 w-4" />
                      {user.vehiclePlate}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-2xl font-bold">127</p>
                <p className="text-xs text-muted-foreground">Fill-ups</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-fuel-green">$842</p>
                <p className="text-xs text-muted-foreground">Saved</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold">4.9</p>
                <p className="text-xs text-muted-foreground">Avg rating</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.settings)}>
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </PageTransition>
    </>
  )
}
