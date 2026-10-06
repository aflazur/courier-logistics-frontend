import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { CourierProfile } from '@/types/api';
import { toast } from 'sonner';

export function useCouriers(params: { page?: number; limit?: number; isAvailable?: boolean } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.isAvailable !== undefined) qs.set('isAvailable', String(params.isAvailable));

  return useQuery({
    queryKey: ['couriers', params],
    queryFn: () => api.get<CourierProfile[]>(`/couriers?${qs.toString()}`),
  });
}

export function useMyCourierProfile() {
  return useQuery({
    queryKey: ['courier-profile', 'me'],
    queryFn: () => api.get<CourierProfile>('/couriers/me'),
  });
}

export function useUpdateCourierProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { isAvailable?: boolean; vehicleType?: string; licenseNumber?: string }) =>
      api.patch<CourierProfile>('/couriers/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courier-profile'] });
      toast.success('Profile updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
