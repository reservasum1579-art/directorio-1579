import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
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
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Announcement } from '@/modules/news/types/news.types';
import { marketplaceService } from '@/modules/marketplace/services/marketplace.service';
import type { MarketplacePost } from '@/modules/marketplace/types/marketplace.types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single() as any;

  const userName = profile?.first_name || user.user_metadata?.full_name?.split(' ')[0] || 'vecino/a';

  // Default building settings (client-editable settings are client-side only)
  const buildingName = 'Directorio 1579';
  const emergencyPhones = [
    { label: 'Seguridad / Portería', number: '11 4567-8900' },
    { label: 'Administración', number: '0800-333-1234' },
    { label: 'Urgencias Ascensores', number: '0810-999-5555' },
    { label: 'Bomberos / Policía', number: '911' }
  ];

  // Fetch real announcements (max 3 for dashboard widget) — server side
  let announcements: Announcement[] = [];
  try {
    const { data } = await supabase
      .from('announcements')
      .select('*, announcement_attachments(*)')
      .eq('building_id', DEFAULT_BUILDING_ID)
      .eq('status', 'published')
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3);
    announcements = (data || []) as Announcement[];
  } catch (e) {
    console.error('Error fetching dashboard announcements:', e);
  }

  // Fetch recent marketplace items
  let marketplaceItems: MarketplacePost[] = [];
  try {
    const allItems = await marketplaceService.getActivePosts(DEFAULT_BUILDING_ID);
    marketplaceItems = allItems.slice(0, 4);
  } catch (e) {
    console.error('Error fetching dashboard marketplace items:', e);
  }

  const userStatus = {
    has_debt: false,
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
      {/* Compact Status Bar */}
      <section>
        <div className="glass bg-primary-50/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-primary-700 font-display font-bold text-lg">{userName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">¡Qué bueno verte!</p>
              <h2 className="font-display font-bold text-text-primary text-lg leading-tight">
                Hola, {userName}
              </h2>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Link href="/expenses" className="flex items-center gap-2 group">
              <div className={`p-2 rounded-lg ${userStatus.has_debt ? 'bg-error-100 text-error-600' : 'bg-success-100 text-success-600'} transition-colors group-hover:scale-105`}>
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Expensas</p>
                <p className="text-sm font-semibold text-text-primary">
                  {userStatus.has_debt ? 'Pendiente' : 'Al día'}
                </p>
              </div>
            </Link>

            {userStatus.next_reservation && (
              <Link href="/sum" className="flex items-center gap-2 group">
                <div className="p-2 rounded-lg bg-accent-100 text-accent-600 transition-colors group-hover:scale-105">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted">SUM</p>
                  <p className="text-sm font-semibold text-text-primary">
                    Hoy, 20:00 hs
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* Quick Links Grid */}
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary-500" /> Accesos rápidos
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
              <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-primary-500" /> Últimas noticias
              </h2>
              <Link
                href="/news"
                className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                Ver todas <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {announcements.length === 0 ? (
                <div className="col-span-full text-center py-8 text-text-muted text-sm">
                  <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  No hay noticias publicadas aún.
                </div>
              ) : (
                announcements.map((ann) => (
                  <Link key={ann.id} href="/news" className="group">
                    <Card 
                      padding="none" 
                      className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${
                        ann.is_important 
                          ? 'border-2 border-error-500 shadow-md shadow-error-500/20 hover:shadow-xl hover:shadow-error-500/30' 
                          : 'border border-border-light hover:border-primary-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="aspect-video bg-background-warm shrink-0 relative overflow-hidden">
                        {ann.announcement_attachments?.[0]?.file_url ? (
                          <img src={ann.announcement_attachments[0].file_url} alt={ann.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <Newspaper className="h-12 w-12 text-slate-300" />
                          </div>
                        )}
                        {ann.is_important && (
                          <div className="absolute top-3 right-3 bg-error-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse-slow">
                            <ShieldAlert className="h-3 w-3" /> Urgente
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1 bg-surface relative">
                        <p suppressHydrationWarning className="text-[10px] uppercase tracking-widest font-bold text-primary-600 mb-1">
                          {new Date(ann.published_at || ann.created_at).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </p>
                        <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-tight">
                          {ann.title}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Emergency Contacts Sidebar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <Phone className="h-6 w-6 text-primary-500" /> Teléfonos Útiles
            </h2>
          </div>
          
          <Card padding="none" className="overflow-hidden border-info-100">
            <div className="bg-info-50 px-4 py-3 border-b border-info-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-info-600" />
              <span className="text-xs font-bold text-info-900 uppercase tracking-wider">Urgencias</span>
            </div>
            <div className="divide-y divide-border-light">
              {(emergencyPhones).map((phone, i) => (
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

      {/* Recent Marketplace */}
      {marketplaceItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <Store className="h-6 w-6 text-primary-500" /> Último en Marketplace
            </h2>
            <Link
              href="/marketplace"
              className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              Ver todo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketplaceItems.map((item) => (
              <Link key={item.id} href="/marketplace" className="group block h-full">
                <Card padding="none" className="h-full flex flex-col overflow-hidden border border-border-light hover:border-primary-300 hover:shadow-lg transition-all">
                  <div className="aspect-video bg-background-warm shrink-0 relative overflow-hidden">
                    {item.marketplace_images?.[0]?.image_url ? (
                      <img src={item.marketplace_images[0].image_url} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.status === 'sold' ? 'blur-sm grayscale opacity-80' : ''}`} />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-slate-100 ${item.status === 'sold' ? 'blur-sm grayscale opacity-80' : ''}`}>
                        <Store className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                      ${(item.price || 0).toLocaleString('es-AR')}
                    </div>
                    {item.status === 'sold' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
                        <span className="bg-error-500/90 text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest rotate-[calc(-15deg)] shadow-xl backdrop-blur-sm border border-error-400">
                          Vendido
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 bg-surface">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1 truncate">{item.category}</p>
                    <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
