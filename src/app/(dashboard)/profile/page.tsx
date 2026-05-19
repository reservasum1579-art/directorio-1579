'use client';

import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  Shield, 
  Bell, 
  Camera, 
  Save, 
  LogOut,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  // LOAD FROM LOCAL STORAGE OR USE DEFAULT
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_profile');
      if (saved) return JSON.parse(saved);
    }
    return {
      first_name: 'Alex',
      last_name: 'Sterling',
      email: 'alex.sterling@example.com',
      phone: '11 2233-4455',
      unit: '14B',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwWmfUu3Pw4xRc2tapDLN86_g_jbGEIkQp3t4TMPF2K343KmAd6tJCl1U2nvnQDt4hrhTQ01G_NCF8uYsfqLeBh9XBzrZx6I8wvFeTqfRse0u3-hqAhEsvfZgfxmW_zCY85ni-X-vS9EOq4erjRBiirMWNcuTkHYF19gp20fdyz9ovmUo4vPA6jELmkvjBcQmlfEfuY27L28QrUzYqToKgr27rm7KyjDs6gfis9FaLOxt_xJ8qjZ9Sw_1m-7TjmW-VK3ljWGBTszD',
      privacy_settings: {
        show_email: false,
        show_phone: true
      }
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setTimeout(() => {
      setIsSaving(false);
      alert('¡Perfil actualizado con éxito!');
    }, 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfile = { ...profile, avatar_url: reader.result as string };
        setProfile(newProfile);
        localStorage.setItem('user_profile', JSON.stringify(newProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex items-end gap-6">
        <div className="relative group">
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <label className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-all active:scale-95 cursor-pointer">
            <Camera className="h-5 w-5" />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <div className="pb-2">
          <Badge variant="info" className="mb-2">Residente Verificado</Badge>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-text-secondary flex items-center gap-2 mt-1">
            <Home className="h-4 w-4 text-primary-500" /> Unidad {profile.unit}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          <Card padding="lg" className="border-border-light">
            <h3 className="font-display font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-500" /> Datos Personales
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Nombre</label>
                  <input 
                    type="text" 
                    value={profile.first_name}
                    onChange={e => setProfile({...profile, first_name: e.target.value})}
                    className="w-full bg-background-warm/50 border border-border-light rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Apellido</label>
                  <input 
                    type="text" 
                    value={profile.last_name}
                    onChange={e => setProfile({...profile, last_name: e.target.value})}
                    className="w-full bg-background-warm/50 border border-border-light rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1 text-glow">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-background-warm/50 border border-border-light rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="w-full bg-background-warm/50 border border-border-light rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-light flex justify-end">
              <Button onClick={handleSave} loading={isSaving} className="bg-primary-600 hover:bg-primary-700 text-white gap-2">
                <Save className="h-4 w-4" /> Guardar Cambios
              </Button>
            </div>
          </Card>

          <Card padding="lg" className="border-border-light">
             <h3 className="font-display font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent-500" /> Seguridad y Privacidad
            </h3>
            
            <div className="space-y-4 divide-y divide-border-light">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Mostrar email a vecinos</p>
                  <p className="text-xs text-text-muted">Si lo activas, otros vecinos verán tu email en el Marketplace.</p>
                </div>
                <button 
                  onClick={() => setProfile({
                    ...profile, 
                    privacy_settings: {...profile.privacy_settings, show_email: !profile.privacy_settings.show_email}
                  })}
                  className={`p-2 rounded-lg transition-all ${profile.privacy_settings.show_email ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}
                >
                  {profile.privacy_settings.show_email ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 pb-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Mostrar teléfono a vecinos</p>
                  <p className="text-xs text-text-muted">Recomendado para coordinar ventas en el Marketplace.</p>
                </div>
                <button 
                  onClick={() => setProfile({
                    ...profile, 
                    privacy_settings: {...profile.privacy_settings, show_phone: !profile.privacy_settings.show_phone}
                  })}
                  className={`p-2 rounded-lg transition-all ${profile.privacy_settings.show_phone ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}
                >
                   {profile.privacy_settings.show_phone ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Card padding="md" className="bg-primary-900 text-white border-none">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notificaciones
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs opacity-90">
                 <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10" />
                 <span>Recibir alertas de SUM</span>
              </div>
              <div className="flex items-center gap-3 text-xs opacity-90">
                 <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10" />
                 <span>Avisos de Marketplace</span>
              </div>
              <div className="flex items-center gap-3 text-xs opacity-90">
                 <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10" />
                 <span>Nuevas Expensas</span>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-between hover:bg-slate-100 text-text-secondary h-12">
              Cambiar Contraseña <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-error-500 hover:bg-error-50 h-12">
              Cerrar Sesión <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center p-4">
             <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Portal Directorio 1579</p>
             <p className="text-[9px] text-text-muted/60 mt-1">Versión 1.2.0 (Build 2026)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
