'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarDays,
  Store,
  Newspaper,
  User,
  Receipt,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'SUM', href: '/sum', icon: CalendarDays },
  { label: 'Expensas', href: '/expenses', icon: Receipt },
  { label: 'Docs', href: '/documents', icon: FolderOpen },
  { label: 'Perfil', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-border-light">
        <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-[--radius-md]',
                  'transition-all duration-[--transition-fast] min-w-[56px]',
                  isActive
                    ? 'text-primary-700'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform duration-[--transition-fast]',
                      isActive && 'scale-110'
                    )}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-500" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium leading-tight',
                    isActive && 'font-semibold'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
