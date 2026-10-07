'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { useAdminUsers, useChangeUserRole, useChangeUserStatus } from '@/hooks/use-admin';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuthStore } from '@/store/auth-store';
import { formatDate } from '@/lib/utils';
import type { Role } from '@/types/api';

const ROLES: Role[] = ['CUSTOMER', 'COURIER', 'ADMIN'];
const roleLabel = (r: string) => r.charAt(0) + r.slice(1).toLowerCase();

export function UsersManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = useAuthStore((s) => s.user);

  // Search, role filter and page all live in the URL so a filtered view can be shared.
  const page = Number(searchParams.get('page') ?? '1');
  const role = searchParams.get('role') ?? '';
  const urlSearch = searchParams.get('search') ?? '';

  const [search, setSearch] = useState(urlSearch);
  const debounced = useDebounce(search);

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    if (debounced !== urlSearch) updateParams({ search: debounced || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit: 10,
    role: role || undefined,
    search: urlSearch || undefined,
  });
  const changeRole = useChangeUserRole();
  const changeStatus = useChangeUserStatus();

  const users = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Users</h2>
        <p className="text-ink-500 text-sm">
          Change roles and activate or deactivate accounts. Every change is written to the audit
          log.
        </p>
      </div>

      <Card>
        <div className="border-ink-100 flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-ink-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              aria-label="Search users"
              className="pl-9"
            />
          </div>
          <Select
            value={role || 'ALL'}
            onValueChange={(v) => updateParams({ role: v === 'ALL' ? null : v, page: null })}
          >
            <SelectTrigger className="sm:w-48" aria-label="Filter by role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {roleLabel(r)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Could not load users"
            description="Check your connection and try again."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try a different search or role filter."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-left text-sm">
                <thead>
                  <tr className="border-ink-100 text-ink-500 border-b font-mono text-xs tracking-wide uppercase">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <tr key={u.id} className="border-ink-100 border-b last:border-0">
                        <td className="px-5 py-3">
                          <p className="text-ink-900 font-medium">
                            {u.name} {isSelf && <span className="text-ink-500 text-xs">(you)</span>}
                          </p>
                          <p className="text-ink-500 text-xs">{u.email}</p>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={u.role === 'ADMIN' ? 'dark' : 'neutral'}>{u.role}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={u.isActive ? 'success' : 'alert'}>
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </Badge>
                        </td>
                        <td className="text-ink-500 px-5 py-3 text-xs whitespace-nowrap">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Select
                              value={u.role}
                              disabled={isSelf || changeRole.isPending}
                              onValueChange={(v) =>
                                changeRole.mutate({ userId: u.id, role: v as Role })
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-32 text-xs"
                                aria-label={`Change role for ${u.name}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {roleLabel(r)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant={u.isActive ? 'outline' : 'signal'}
                              disabled={isSelf || changeStatus.isPending}
                              onClick={() =>
                                changeStatus.mutate({ userId: u.id, isActive: !u.isActive })
                              }
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {data?.meta && <Pagination meta={data.meta} />}
          </>
        )}
      </Card>
    </div>
  );
}
