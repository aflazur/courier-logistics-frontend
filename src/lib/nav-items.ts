import {
  LayoutDashboard,
  Package,
  FileClock,
  User,
  CreditCard,
  Truck,
  Wallet,
  PackagePlus,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/types/api';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/manage', label: 'Shipments', icon: Package },
    { href: '/admin/reports', label: 'Audit Logs', icon: FileClock },
  ],
  CUSTOMER: [
    { href: '/dashboard', label: 'My Shipments', icon: Package },
    { href: '/dashboard/shipments/new', label: 'New Shipment', icon: PackagePlus },
    { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ],
  COURIER: [
    { href: '/provider', label: 'My Deliveries', icon: Truck },
    { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
    { href: '/provider/profile', label: 'Profile', icon: User },
  ],
};
