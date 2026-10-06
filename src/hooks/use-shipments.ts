import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ApiResponse, Shipment, ShipmentStatus } from '@/types/api';
import { toast } from 'sonner';

export interface ShipmentListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

function buildQuery(params: ShipmentListParams) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);
  return qs.toString();
}

export function useShipments(params: ShipmentListParams, scope: 'admin' | 'mine' | 'assigned') {
  const path =
    scope === 'admin'
      ? '/shipments'
      : scope === 'mine'
        ? '/shipments/my-shipments'
        : '/shipments/my-assigned';

  return useQuery({
    queryKey: ['shipments', scope, params],
    queryFn: () => api.get<Shipment[]>(`${path}?${buildQuery(params)}`),
  });
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn: () => api.get<Shipment>(`/shipments/${id}`),
    enabled: !!id,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      recipientName: string;
      recipientPhone: string;
      pickupAddress: string;
      deliveryAddress: string;
      weightKg: number;
      parcelType?: string;
      declaredValue?: number;
    }) => api.post<Shipment>('/shipments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAssignCourier(shipmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courierProfileId: string) =>
      api.patch<Shipment>(`/shipments/${shipmentId}/assign`, { courierProfileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', shipmentId] });
      toast.success('Courier assigned');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateShipmentStatus(shipmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { status: ShipmentStatus; note?: string }) =>
      api.patch<Shipment>(`/shipments/${shipmentId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', shipmentId] });
      toast.success('Status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCancelShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shipmentId: string) => api.post<Shipment>(`/shipments/${shipmentId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment cancelled');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export type { ApiResponse };
