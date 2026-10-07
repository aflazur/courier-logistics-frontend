import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { HubInput } from '@/lib/hub-validation';
import type { Hub } from '@/types/api';

export function useHubs(city?: string) {
  const qs = city ? `?city=${encodeURIComponent(city)}` : '';
  return useQuery({
    queryKey: ['hubs', city],
    queryFn: () => api.get<Hub[]>(`/hubs${qs}`),
  });
}

export function useCreateHub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HubInput) => api.post<Hub>('/hubs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      toast.success('Hub created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateHub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HubInput }) =>
      api.patch<Hub>(`/hubs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      toast.success('Hub updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteHub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<unknown>(`/hubs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      toast.success('Hub removed');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
