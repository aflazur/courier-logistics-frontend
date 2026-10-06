'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

export function LogoutButton({ variant = 'ghost' as const }: { variant?: 'ghost' | 'outline' }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out');
      router.push('/login');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant={variant} size="sm" onClick={handleLogout} disabled={loading}>
      <LogOut className="h-4 w-4" /> Log out
    </Button>
  );
}
