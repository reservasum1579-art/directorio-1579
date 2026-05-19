import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from './DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // MOCKED DATA FOR DEMO
  const profile = {
    id: 'mock-id',
    auth_user_id: 'mock-auth-id',
    first_name: 'Patricio',
    last_name: 'Kenny',
    phone: '11 2233-4455',
    email: 'p.kenny@directorio.com',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwWmfUu3Pw4xRc2tapDLN86_g_jbGEIkQp3t4TMPF2K343KmAd6tJCl1U2nvnQDt4hrhTQ01G_NCF8uYsfqLeBh9XBzrZx6I8wvFeTqfRse0u3-hqAhEsvfZgfxmW_zCY85ni-X-vS9EOq4erjRBiirMWNcuTkHYF19gp20fdyz9ovmUo4vPA6jELmkvjBcQmlfEfuY27L28QrUzYqToKgr27rm7KyjDs6gfis9FaLOxt_xJ8qjZ9Sw_1m-7TjmW-VK3ljWGBTszD',
    show_phone: true,
    show_email: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role: 'resident'
  };

  const isAdmin = false;

  return (
    <DashboardShell
      profile={profile}
      isAdmin={isAdmin}
      unit="6° C"
    >
      {children}
    </DashboardShell>
  );
}
