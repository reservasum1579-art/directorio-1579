'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarDays,
  Store,
  Newspaper,
  User,
  Phone,
  Receipt,
  Shield,
  Users,
  Building2,
  Settings,
  LayoutDashboard,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { settingsService } from '@/modules/admin/services/settings.service';

const mainNav = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'SUM', href: '/sum', icon: CalendarDays },
  { label: 'Marketplace', href: '/marketplace', icon: Store },
  { label: 'Noticias', href: '/news', icon: Newspaper },
  { label: 'Contactos', href: '/contacts', icon: Phone },
  { label: 'Expensas', href: '/expenses', icon: Receipt },
  { label: 'Mi Perfil', href: '/profile', icon: User },
];

const adminNav = [
  { label: 'Admin', href: '/admin', icon: LayoutDashboard },
  { label: 'Usuarios', href: '/admin/users', icon: Users },
  { label: 'Departamentos', href: '/admin/units', icon: Building2 },
  { label: 'Gestión SUM', href: '/admin/sum', icon: Shield },
  { label: 'Gestión Expensas', href: '/admin/expenses', icon: Receipt },
  { label: 'Moderación', href: '/admin/marketplace', icon: FileEdit },
  { label: 'Noticias', href: '/admin/news', icon: Newspaper },
  { label: 'Mantenimiento', href: '/admin/maintenance', icon: Wrench },
  { label: 'Configuración', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  isAdmin?: boolean;
  onSignOut?: () => void;
}



export function Sidebar({ isAdmin = false, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [buildingName, setBuildingName] = useState('Directorio 1579');

  useEffect(() => {
    const loadSettings = () => {
      const settings = settingsService.getSettings();
      setBuildingName(settings.name);
    };

    loadSettings();
    window.addEventListener('building_settings_updated', loadSettings);
    return () => window.removeEventListener('building_settings_updated', loadSettings);
  }, []);

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href);

  const renderLink = (item: { label: string; href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md]',
          'transition-all duration-[--transition-fast] group',
          active
            ? 'bg-primary-700/10 text-primary-700 font-medium'
            : 'text-text-secondary hover:bg-background-warm hover:text-text-primary'
        )}
      >
        <Icon
          className={cn('h-[18px] w-[18px] shrink-0', active && 'text-primary-700')}
          strokeWidth={active ? 2.2 : 1.8}
        />
        {!collapsed && (
          <span className="text-sm truncate">{item.label}</span>
        )}
        {active && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0',
        'bg-surface border-r border-border-light',
        'transition-all duration-[--transition-base]',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-border-light shrink-0',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-[--radius-md] bg-primary-700 flex items-center justify-center shrink-0">
          <span className="text-white font-display font-bold text-sm">
            {buildingName.charAt(0)}
          </span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-display text-sm font-bold text-primary-700 truncate">
              {buildingName}
            </h1>
            <p className="text-[10px] text-text-muted font-medium">Portal Vecinal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNav.map(renderLink)}

        {isAdmin && (
          <>
            <div className={cn(
              'my-3 border-t border-border-light',
              collapsed ? 'mx-1' : 'mx-0'
            )} />
            {!collapsed && (
              <p className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Administración
              </p>
            )}
            {adminNav.map(renderLink)}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border-light shrink-0 space-y-1">
        {onSignOut && (
          <button
            onClick={onSignOut}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] w-full',
              'text-text-secondary hover:bg-error-50 hover:text-error-500',
              'transition-all duration-[--transition-fast] cursor-pointer'
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
            {!collapsed && <span className="text-sm">Cerrar sesión</span>}
          </button>
        )}

        {/* Admin Quick Access Toggle */}
        <Link
          href={isAdmin ? '/' : '/admin'}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] w-full mb-2',
            'transition-all duration-[--transition-fast] group',
            isAdmin 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20'
          )}
        >
          {isAdmin ? (
            <Home className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
          ) : (
            <Shield className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
          )}
          {!collapsed && (
            <span className="text-sm font-black tracking-tight">
              {isAdmin ? 'Volver a Portal' : 'Panel Admin'}
            </span>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-[--radius-md]',
            'text-text-muted hover:bg-background-warm hover:text-text-secondary',
            'transition-all duration-[--transition-fast] cursor-pointer'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
