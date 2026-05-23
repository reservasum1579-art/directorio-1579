'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Newspaper, 
  CalendarDays, 
  Store, 
  Receipt, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export interface Notification {
  id: string;
  type: 'news' | 'sum' | 'marketplace' | 'expenses' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'news',
    title: 'Comunicado Urgente',
    description: 'Se realizará el mantenimiento de ascensores mañana de 10:00 a 14:00.',
    time: 'Hace 5 min',
    read: false
  },
  {
    id: '2',
    type: 'sum',
    title: 'Reserva Confirmada',
    description: 'Tu reserva del SUM para el 25/05 ha sido aprobada.',
    time: 'Hace 1 hora',
    read: false
  },
  {
    id: '3',
    type: 'expenses',
    title: 'Expensas Disponibles',
    description: 'Ya podés consultar la liquidación del mes de Mayo.',
    time: 'Hace 3 horas',
    read: true
  },
  {
    id: '4',
    type: 'marketplace',
    title: 'Nuevo Aviso en Marketplace',
    description: 'Un vecino publicó: "Bicicleta Olmo Rodado 29".',
    time: 'Hace 5 horas',
    read: true
  },
  {
    id: '5',
    type: 'system',
    title: 'Perfil Actualizado',
    description: 'Los cambios en tu perfil se guardaron correctamente.',
    time: 'Ayer',
    read: true
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<Notification['type'] | 'all'>('all');

  useEffect(() => {
    const handleNewNotification = (e: any) => {
      setNotifications(prev => [e.detail, ...prev]);
    };
    window.addEventListener('new_notification', handleNewNotification);
    return () => window.removeEventListener('new_notification', handleNewNotification);
  }, []);

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'news': return <Newspaper className="h-4 w-4" />;
      case 'sum': return <CalendarDays className="h-4 w-4" />;
      case 'marketplace': return <Store className="h-4 w-4" />;
      case 'expenses': return <Receipt className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'news': return 'bg-error-500/10 text-error-600';
      case 'sum': return 'bg-primary-500/10 text-primary-600';
      case 'marketplace': return 'bg-success-500/10 text-success-600';
      case 'expenses': return 'bg-warning-500/10 text-warning-600';
      default: return 'bg-slate-500/10 text-slate-600';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 sm:hidden bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "fixed sm:absolute right-0 top-0 sm:top-full sm:mt-3 z-[60]",
        "w-full sm:w-[400px] h-full sm:h-auto max-h-[calc(100vh-120px)]",
        "bg-white/95 backdrop-blur-xl border-l sm:border border-border-light sm:rounded-[2rem] shadow-2xl shadow-primary-900/10",
        "flex flex-col overflow-hidden animate-in slide-in-from-right-5 sm:zoom-in-95 sm:fade-in duration-300"
      )}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-light bg-background-warm/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-xl text-text-primary tracking-tight">Notificaciones</h3>
              {unreadCount > 0 && (
                <Badge variant="error" size="sm">{unreadCount}</Badge>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-text-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'news', 'sum', 'expenses', 'marketplace'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                  filter === type 
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" 
                    : "bg-slate-100 text-text-muted hover:bg-slate-200"
                )}
              >
                {type === 'all' ? 'Todas' : type === 'news' ? 'Noticias' : type === 'sum' ? 'Reservas' : type === 'expenses' ? 'Expensas' : 'Market'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border-light/50 bg-white/50">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <button 
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "w-full px-6 py-5 flex gap-4 text-left transition-all group relative",
                  !notif.read ? "bg-primary-50/50 hover:bg-primary-50" : "hover:bg-slate-50/50"
                )}
              >
                {!notif.read && (
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary-600 rounded-r-full shadow-[2px_0_8px_rgba(37,99,235,0.4)]" />
                )}
                <div className={cn(
                  "h-10 w-10 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110", 
                  getColor(notif.type)
                )}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={cn(
                      "text-sm truncate tracking-tight", 
                      !notif.read ? "font-black text-text-primary" : "font-bold text-text-secondary"
                    )}>
                      {notif.title}
                    </p>
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-medium">
                    {notif.description}
                  </p>
                </div>
                <div className="flex items-center">
                  {!notif.read ? (
                     <div className="h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
                  ) : (
                    <Check className="h-3 w-3 text-success-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="py-24 text-center space-y-4 px-10">
              <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300 border-2 border-dashed border-slate-200">
                <Bell className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-text-primary font-black uppercase tracking-widest">Sin Notificaciones</p>
                <p className="text-xs text-text-muted font-medium">No hay alertas para mostrar en esta categoría.</p>
              </div>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="text-xs font-black text-primary-600 hover:underline pt-2"
                >
                  Ver todas las notificaciones
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border-light bg-slate-50/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <button 
               onClick={markAllRead}
               className="flex-1 py-3 bg-white border border-border-light rounded-2xl text-[10px] font-black text-text-muted hover:text-primary-600 hover:border-primary-200 hover:shadow-sm transition-all uppercase tracking-widest flex items-center justify-center gap-2"
             >
               <CheckCircle2 className="h-3.5 w-3.5" /> Marcar Leídas
             </button>
             <button className="flex-1 py-3 bg-primary-600 text-white rounded-2xl text-[10px] font-black hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
               Ver Historial <ArrowRight className="h-3.5 w-3.5" />
             </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Internal dependencies for the component
function Badge({ children, variant = 'error', size = 'sm' }: { children: React.ReactNode, variant?: 'error' | 'neutral', size?: 'sm' }) {
  return (
    <span className={cn(
      "rounded-full font-black flex items-center justify-center shadow-sm",
      variant === 'error' ? "bg-error-500 text-white shadow-error-500/20" : "bg-slate-200 text-slate-600",
      size === 'sm' ? "min-w-[18px] h-[18px] px-1 text-[9px]" : "min-w-[22px] h-[22px] px-1.5 text-[10px]"
    )}>
      {children}
    </span>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
