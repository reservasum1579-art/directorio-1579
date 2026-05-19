'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  unit?: string;
}

export function Header({
  title,
  subtitle,
  firstName = '',
  lastName = '',
  avatarUrl,
  notificationCount = 2, // Hardcoded unread for demo
  unit,
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass border-b border-border-light">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
        {/* Left: Title or greeting */}
        <div className="min-w-0">
          {title ? (
            <>
              <h1 className="font-display text-lg font-semibold text-text-primary truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-text-muted truncate">{subtitle}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-xs text-text-muted">Bienvenido</p>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-semibold text-text-primary truncate">
                  {firstName} {lastName}
                </h1>
                {unit && (
                  <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-primary-200">
                    {unit}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                'relative p-2 rounded-[--radius-md]',
                'text-text-secondary hover:bg-background-warm hover:text-text-primary',
                'transition-all duration-[--transition-fast] cursor-pointer',
                isNotificationsOpen && 'bg-background-warm text-text-primary'
              )}
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" strokeWidth={1.8} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-surface">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            <NotificationCenter 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
            />
          </div>

          <div className="hidden sm:block">
            <Avatar
              src={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
