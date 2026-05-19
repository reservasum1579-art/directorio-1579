'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import type { Profile } from '@/types/global.types';

interface DashboardShellProps {
  profile: Profile | null;
  isAdmin: boolean;
  unit?: string;
  children: React.ReactNode;
}

export function DashboardShell({ profile: initialProfile, isAdmin, unit, children }: DashboardShellProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    // Sync with localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    }
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar isAdmin={isAdmin} onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          firstName={profile?.first_name}
          lastName={profile?.last_name}
          avatarUrl={profile?.avatar_url}
          unit={unit}
          isAdmin={isAdmin}
        />

        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
