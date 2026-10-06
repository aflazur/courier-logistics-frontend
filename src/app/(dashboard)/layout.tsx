import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopbar } from '@/components/layout/dashboard-topbar';

// Middleware already blocks unauthenticated/wrong-role access before this ever renders, but we
// re-check here too - this layout needs the session object anyway to build the sidebar/topbar,
// and a defense-in-depth check costs nothing.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="bg-chalk-50 flex min-h-screen">
      <DashboardSidebar role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar user={session} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
