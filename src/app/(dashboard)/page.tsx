'use client';

import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CalendarDays,
  Newspaper,
  Store,
  Phone,
  Receipt,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { settingsService, BuildingSettings } from '@/modules/admin/services/settings.service';

export default function DashboardPage() {
  const [settings, setSettings] = useState<BuildingSettings | null>(null);
  const [userName, setUserName] = useState('Alex');

  useEffect(() => {
    // Load dynamic name from profile
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        const profile = JSON.parse(saved);
        setUserName(profile.first_name || 'Alex');
      }
    }
    const loadSettings = () => {
      setSettings(settingsService.getSettings());
    };
    loadSettings();
    window.addEventListener('building_settings_updated', loadSettings);
    return () => window.removeEventListener('building_settings_updated', loadSettings);
  }, []);

  // MOCK DATA FOR DEMO
  const announcements = [
    { 
      id: '1', 
      title: 'Mantenimiento del ascensor principal', 
      is_important: true, 
      published_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=200'
    },
    { 
      id: '2', 
      title: 'Reunión de consorcio mensual', 
      is_important: false, 
      published_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=200'
    },
  ];

  const userStatus = {
    has_debt: true,
    next_reservation: {
      date: '2026-05-16',
      shift: 'Noche',
      type: 'Parrilla/SUM'
    }
  };

  const quickLinks = [
    {
      label: 'Reservar SUM',
      description: 'Salón de usos múltiples',
      href: '/sum',
      icon: CalendarDays,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'Noticias',
      description: 'Novedades del edificio',
      href: '/news',
      icon: Newspaper,
      color: 'text-accent-700 bg-accent-50',
    },
    {
      label: 'Marketplace',
      description: 'Comprá y vendé',
      href: '/marketplace',
      icon: Store,
      color: 'text-success-700 bg-success-50',
    },
    {
      label: 'Contactos',
      description: 'Números útiles',
      href: '/contacts',
      icon: Phone,
      color: 'text-info-500 bg-info-50',
    },
    {
      label: 'Expensas',
      description: 'Estado de cuenta',
      href: '/expenses',
      icon: Receipt,
      color: 'text-warning-700 bg-warning-50',
    },
  ];

  return (
    <div className="space-y-8 stagger-children pb-20">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            ¡Hola, {userName}! 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Bienvenido a tu portal de {settings?.name || 'Directorio 1579'}.
          </p>
        </div>
      </section>

      {/* Resident Summary Widgets */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className={`border-none ${userStatus.has_debt ? 'bg-error-500' : 'bg-success-500'} text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase opacity-80 tracking-widest">Estado de Expensas</p>
              <h3 className="text-xl font-bold">
                {userStatus.has_debt ? 'Tenés una expensa pendiente' : '¡Estás al día!'}
              </h3>
              <p className="text-xs opacity-90">
                {userStatus.has_debt ? 'Vencimiento: 15 de Mayo' : 'Gracias por tu puntualidad.'}
              </p>
            </div>
            <Link href="/expenses">
              <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                <Receipt className="h-6 w-6" />
              </button>
            </Link>
          </div>
        </Card>

        {userStatus.next_reservation && (
          <Card className="bg-primary-600 text-white border-none shadow-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase opacity-80 tracking-widest">Próxima Reserva SUM</p>
                <h3 className="text-xl font-bold">
                  {userStatus.next_reservation.type}
                </h3>
                <p className="text-xs opacity-90">
                  {new Date(userStatus.next_reservation.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} • Turno {userStatus.next_reservation.shift}
                </p>
              </div>
              <Link href="/sum">
                <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                  <CalendarDays className="h-6 w-6" />
                </button>
              </Link>
            </div>
          </Card>
        )}
      </section>
      {/* Quick Links Grid */}
      <section>
        <h2 className="font-display text-base font-semibold text-text-primary mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card hoverable padding="md" className="text-center h-full">
                  <div
                    className={`w-10 h-10 rounded-[--radius-md] flex items-center justify-center mx-auto mb-2 ${link.color}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    {link.label}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 hidden sm:block">
                    {link.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Announcements */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-semibold text-text-primary">
                Últimas noticias
              </h2>
              <Link
                href="/news"
                className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                Ver todas <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {announcements.map((ann) => (
                <Link key={ann.id} href={`/news`}>
                  <Card hoverable padding="none" className="flex items-stretch overflow-hidden">
                    <div className="w-20 sm:w-24 bg-background-warm shrink-0 relative overflow-hidden">
                      {ann.image_url ? (
                        <img src={ann.image_url} alt={ann.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="h-5 w-5 text-text-muted opacity-30" />
                        </div>
                      )}
                      {ann.is_important && (
                        <div className="absolute top-0 left-0 bg-error-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-br-lg shadow-lg">
                          Urgente
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-3 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {ann.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {new Date(ann.published_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center px-4">
                      <ArrowRight className="h-4 w-4 text-text-muted shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Emergency Contacts Sidebar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Teléfonos Útiles
            </h2>
          </div>
          
          <Card padding="none" className="overflow-hidden border-info-100">
            <div className="bg-info-50 px-4 py-3 border-b border-info-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-info-600" />
              <span className="text-xs font-bold text-info-900 uppercase tracking-wider">Urgencias</span>
            </div>
            <div className="divide-y divide-border-light">
              {settings?.emergency_phones.map((phone, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{phone.label}</p>
                    <p className="text-sm font-bold text-primary-700 font-mono tracking-tight">{phone.number}</p>
                  </div>
                  <button className="p-2 bg-white border border-border rounded-lg text-primary-600 hover:bg-primary-50 transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
