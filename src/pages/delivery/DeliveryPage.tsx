import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AppHeader } from '@/layouts/AppHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useDeliveryOrders, useCreateDelivery } from '@/hooks/useDelivery'
import { mockStations } from '@/mock/stations'
import { formatPrice } from '@/utils/format'
import type { FuelType } from '@/types/station'
import { Truck, MapPin, CreditCard, Package } from 'lucide-react'

const schema = z.object({
  stationId: z.string().min(1),
  fuelType: z.enum(['ai92', 'ai95', 'ai98', 'diesel', 'gas']),
  liters: z.number().min(10).max(200),
  address: z.string().min(5),
  paymentMethod: z.string().min(1),
})

type FormData = z.infer<typeof schema>

const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: 'ai92', label: 'AI-92' },
  { value: 'ai95', label: 'AI-95' },
  { value: 'diesel', label: 'Diesel' },
]

const STEPS = ['Fuel', 'Location', 'Payment', 'Confirm']

export default function DeliveryPage() {
  const [step, setStep] = useState(0)
  const { data: orders } = useDeliveryOrders()
  const createOrder = useCreateDelivery()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      stationId: mockStations[0].id,
      fuelType: 'ai95',
      liters: 40,
      address: '',
      paymentMethod: 'FuelGo Wallet',
    },
  })

  const liters = watch('liters') || 40
  const estimatedPrice = liters * 10000

  const onSubmit = (data: FormData) => {
    createOrder.mutate({
      ...data,
      lat: 41.31,
      lng: 69.28,
    })
    setStep(0)
  }

  return (
    <>
      <AppHeader title="Fuel delivery" />
      <PageTransition className="p-4 lg:p-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                New delivery
              </CardTitle>
              <div className="flex gap-2">
                {STEPS.map((s, i) => (
                  <Badge key={s} variant={i <= step ? 'success' : 'muted'}>
                    {s}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {step === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label>Station</Label>
                      <select
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                        {...register('stationId')}
                      >
                        {mockStations.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel type</Label>
                      <div className="flex gap-2">
                        {FUEL_TYPES.map((f) => (
                          <label key={f.value} className="flex-1">
                            <input type="radio" value={f.value} {...register('fuelType')} className="peer sr-only" />
                            <span className="flex cursor-pointer items-center justify-center rounded-lg border border-border py-2 text-sm peer-checked:border-accent peer-checked:bg-accent/10">
                              {f.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Liters</Label>
                      <Input type="number" {...register('liters')} />
                      {errors.liters && <p className="text-xs text-destructive">{errors.liters.message}</p>}
                    </div>
                    <Button type="button" className="w-full" onClick={() => setStep(1)}>
                      Continue
                    </Button>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Delivery address
                      </Label>
                      <Input placeholder="Street, building, floor" {...register('address')} />
                      {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                    </div>
                    <p className="text-sm text-muted-foreground">Estimated arrival: ~25 minutes</p>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                      <Button type="button" className="flex-1" onClick={() => setStep(2)}>Continue</Button>
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment method
                      </Label>
                      <select
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                        {...register('paymentMethod')}
                      >
                        <option>FuelGo Wallet</option>
                        <option>Visa •••• 4242</option>
                        <option>Payme</option>
                        <option>Click</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button type="button" className="flex-1" onClick={() => setStep(3)}>Review</Button>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <div className="rounded-lg border border-border p-4 space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Fuel:</span> {watch('fuelType')} · {liters}L</p>
                      <p><span className="text-muted-foreground">Total:</span> {formatPrice(estimatedPrice)}</p>
                      <p><span className="text-muted-foreground">Address:</span> {watch('address')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                      <Button type="submit" variant="accent" className="flex-1" disabled={createOrder.isPending}>
                        {createOrder.isPending ? 'Placing...' : 'Place order'}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="font-display font-semibold">Active orders</h2>
            {orders?.map((o) => (
              <Card key={o.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="warning" className="mb-2">{o.status.replace('_', ' ')}</Badge>
                      <p className="font-medium">{o.stationName}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.liters}L {o.fuelType} · ETA {o.estimatedMinutes} min
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width:
                          o.status === 'delivered'
                            ? '100%'
                            : o.status === 'en_route'
                              ? '75%'
                              : '40%',
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageTransition>
    </>
  )
}
