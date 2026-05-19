'use client';

import { 
  Phone, 
  Mail, 
  Shield, 
  Wrench, 
  Building2, 
  MessageSquare, 
  ExternalLink,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useEffect, useState } from 'react';
import { settingsService, BuildingSettings } from '@/modules/admin/services/settings.service';

export default function ContactsPage() {
  const [settings, setSettings] = useState<BuildingSettings | null>(null);

  useEffect(() => {
    setSettings(settingsService.getSettings());
  }, []);

  const staffContacts = [
    {
      role: 'Encargado Principal',
      name: 'Ricardo Gómez',
      phone: '11 4455-6677',
      hours: 'Lun a Vie 08:00 - 12:00 | 16:00 - 20:00',
      icon: Building2,
      color: 'bg-primary-500/10 text-primary-600'
    },
    {
      role: 'Seguridad / Totem',
      name: 'Vigilancia 24hs',
      phone: '0810-333-4444',
      hours: 'Disponible 24/7',
      icon: Shield,
      color: 'bg-accent-500/10 text-accent-700'
    },
    {
      role: 'Mantenimiento Ascensores',
      name: 'Ascensores Aries',
      phone: '0800-222-1111',
      hours: 'Guardia 24hs',
      icon: Wrench,
      color: 'bg-amber-500/10 text-amber-600'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
          Contactos Útiles
        </h1>
        <p className="text-text-secondary">
          Números de emergencia, servicios del edificio y administración.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Building Services & Staff */}
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">
              Personal y Servicios del Edificio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffContacts.map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <Card key={i} padding="lg" hoverable className="border-border-light group">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${contact.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter mb-0.5">{contact.role}</p>
                        <h4 className="font-bold text-text-primary mb-1 truncate">{contact.name}</h4>
                        <p className="text-sm font-mono font-bold text-primary-700 mb-2">{contact.phone}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                          <Clock className="h-3 w-3" /> {contact.hours}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-light flex gap-2">
                      <a 
                        href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`} 
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2 rounded-lg text-center transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="h-3.5 w-3.5" /> Llamar
                      </a>
                      <button className="p-2 bg-background-warm hover:bg-slate-200 rounded-lg text-text-secondary transition-colors">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Administration Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">
              Administración de Consorcio
            </h2>
            <Card padding="none" className="overflow-hidden border-border-light">
              <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-text-primary">Administración {settings?.name.split(' ')[0] || 'Directorio'}</h3>
                    <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-primary-500" /> Av. Directorio 1579, CABA
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge variant="success" className="h-fit">Abierto hoy hasta 18:00hs</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border-light">
                <div className="p-6 border-b md:border-b-0 md:border-r border-border-light hover:bg-slate-50 transition-colors group">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Atención Telefónica</p>
                  <p className="text-lg font-bold text-text-primary mb-1">4567-8901</p>
                  <p className="text-xs text-text-muted">Interno: 104 (Expensas)</p>
                  <ArrowRight className="h-4 w-4 text-primary-500 mt-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
                <div className="p-6 hover:bg-slate-50 transition-colors group">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Canal Digital</p>
                  <p className="text-lg font-bold text-text-primary mb-1">admin@consorcio.com</p>
                  <p className="text-xs text-text-muted">Respuesta en menos de 24hs</p>
                  <ArrowRight className="h-4 w-4 text-primary-500 mt-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Emergency & Social */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">
              Urgencias Médicas y Seguridad
            </h2>
            <Card padding="none" className="overflow-hidden border-error-100">
              <div className="bg-error-50 px-4 py-3 border-b border-error-100 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-error-600" />
                <span className="text-xs font-bold text-error-900 uppercase tracking-wider">Emergencias 24hs</span>
              </div>
              <div className="divide-y divide-border-light">
                {settings?.emergency_phones.map((phone, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between group hover:bg-error-50/30 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-text-primary mb-0.5">{phone.label}</p>
                      <p className="text-xl font-bold text-error-600 font-mono tracking-tighter">{phone.number}</p>
                    </div>
                    <a 
                      href={`tel:${phone.number}`}
                      className="p-3 bg-white border border-error-200 rounded-xl text-error-600 shadow-sm hover:shadow-md hover:bg-error-500 hover:text-white transition-all active:scale-95"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <Card padding="lg" className="bg-primary-900 text-white border-none relative overflow-hidden">
             <div className="relative z-10">
              <h3 className="font-display font-bold text-lg mb-2">Sitio del Consorcio</h3>
              <p className="text-xs text-primary-200 mb-6 leading-relaxed">
                Accedé a la documentación legal, reglamentos y actas de asambleas anteriores.
              </p>
              <button className="w-full bg-white text-primary-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors">
                Ingresar al Portal <ExternalLink className="h-3 w-3" />
              </button>
             </div>
             {/* Decorative element */}
             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-800 rounded-full blur-2xl opacity-50" />
          </Card>
        </div>
      </div>
    </div>
  );
}
