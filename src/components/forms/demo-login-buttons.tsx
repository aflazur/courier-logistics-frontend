'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShieldCheck, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { roleHomePath } from '@/lib/auth-shared';
import type { Role } from '@/types/api';

const DEMO_ROLES: { role: Role; label: string; icon: typeof ShieldCheck }[] = [
  { role: 'ADMIN', label: 'Admin', icon: ShieldCheck },
  { role: 'CUSTOMER', label: 'Customer', icon: User },
  { role: 'COURIER', label: 'Courier', icon: Truck },
];

export function DemoLoginButtons() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);

  const handleDemoLogin = async (role: Role) => {
    setLoadingRole(role);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const body = await res.json();

      if (!res.ok || !body.success) {
        toast.error(body.message || `Demo ${role.toLowerCase()} login failed`);
        return;
      }

      const user = body.data.user;
      setUser({ id: user.id, name: user.name, email: user.email, role: user.role });
      toast.success(`Logged in as demo ${role.toLowerCase()}`);
      router.push(roleHomePath(user.role));
      router.refresh();
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {DEMO_ROLES.map(({ role, label, icon: Icon }) => (
        <Button
          key={role}
          type="button"
          variant="outline"
          className="h-auto flex-col gap-1.5 py-3"
          disabled={loadingRole !== null}
          onClick={() => handleDemoLogin(role)}
        >
          <Icon className="h-4 w-4" />
          <span className="text-xs">{loadingRole === role ? '...' : label}</span>
        </Button>
      ))}
    </div>
  );
}
