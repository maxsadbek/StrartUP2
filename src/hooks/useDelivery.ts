import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/services/api/queryKeys'
import { deliveryService } from '@/services/delivery.service'
import type { DeliveryRequest } from '@/types/delivery'
import { toast } from 'sonner'

export function useDeliveryOrders() {
  return useQuery({
    queryKey: queryKeys.delivery.orders,
    queryFn: () => deliveryService.getOrders(),
  })
}

export function useCreateDelivery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DeliveryRequest) => deliveryService.createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.delivery.orders })
      toast.success('Delivery order placed', {
        description: 'Your fuel is on the way.',
      })
    },
    onError: () => toast.error('Failed to place order'),
  })
}
