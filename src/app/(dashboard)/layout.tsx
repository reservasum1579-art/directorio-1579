import React, { ReactNode } from 'react';
import { DashboardShell } from '@/app/(dashboard)/DashboardShell';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Placeholder profile; replace with real data as needed
  const profile = null;
  const isAdmin = false;
  const unit = '6C';
  return (
    <DashboardShell profile={profile} isAdmin={isAdmin} unit={unit}>
      {children}
    </DashboardShell>
  );
}
