import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Payment } from '@/types/api';
import { toast } from 'sonner';

export function usePayment(shipmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['payment', shipmentId],
    queryFn: () => api.get<Payment>(`/payments/${shipmentId}`),
    enabled: !!shipmentId && enabled,
    retry: false,
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: ({ shipmentId, phone }: { shipmentId: string; phone?: string }) =>
      api.post<{ gatewayUrl: string; paymentId: string; tran_id: string }>('/payments/initiate', {
        shipmentId,
        phone,
      }),
    onError: (err: Error) => toast.error(err.message),
  });
}
