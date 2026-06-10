import React, { ReactNode } from 'react';
import { DashboardShell } from '@/app/(dashboard)/DashboardShell';
import { createClient } from '@/lib/supabase/server';
import { formatUnit } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, profiles_units(units(floor, unit))')
    .eq('id', user.id)
    .single() as any;

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'admin_consorcio';
  
  let unitStr = '';
  if (profile?.profiles_units && profile.profiles_units.length > 0) {
    const u = profile.profiles_units[0].units;
    if (u) {
      unitStr = formatUnit(u.floor, u.unit);
    }
  }

  return (
    <DashboardShell profile={profile} isAdmin={isAdmin} unit={unitStr}>
      {children}
    </DashboardShell>
  );
}
