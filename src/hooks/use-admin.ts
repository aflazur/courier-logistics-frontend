import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { AuditLog, DashboardStats, Role, User } from '@/types/api';
import { toast } from 'sonner';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/admin/dashboard-stats'),
  });
}

export function useAdminUsers(
  params: { page?: number; limit?: number; role?: string; search?: string } = {},
) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.role) qs.set('role', params.role);
  if (params.search) qs.set('search', params.search);

  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => api.get<User[]>(`/admin/users?${qs.toString()}`),
  });
}

export function useAuditLogs(params: { page?: number; limit?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));

  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => api.get<AuditLog[]>(`/admin/audit-logs?${qs.toString()}`),
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      api.patch<User>(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Role updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      api.patch<User>(`/admin/users/${userId}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
