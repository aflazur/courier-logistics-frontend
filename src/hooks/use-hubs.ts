import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Hub } from '@/types/api';

export function useHubs(city?: string) {
  const qs = city ? `?city=${encodeURIComponent(city)}` : '';
  return useQuery({
    queryKey: ['hubs', city],
    queryFn: () => api.get<Hub[]>(`/hubs${qs}`),
  });
}
