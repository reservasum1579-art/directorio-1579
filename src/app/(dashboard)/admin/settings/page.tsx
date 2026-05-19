'use client';

import { useState, useEffect } from 'react';
import { Building2, Phone, Save, Plus, Trash2, ShieldCheck, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { settingsService, BuildingSettings } from '@/modules/admin/services/settings.service';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BuildingSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(settingsService.getSettings());
  }, []);

  const handleSave = () => {
    if (settings) {
      setIsSaving(true);
      settingsService.updateSettings(settings);
      setTimeout(() => {
        setIsSaving(false);
        alert('Configuración guardada exitosamente.');
      }, 800);
    }
  };

  const addPhone = () => {
    if (settings) {
      setSettings({
        ...settings,
        emergency_phones: [...settings.emergency_phones, { label: 'Nuevo Contacto', number: '' }]
      });
    }
  };

  const removePhone = (index: number) => {
    if (settings) {
      const newPhones = [...settings.emergency_phones];
      newPhones.splice(index, 1);
      setSettings({ ...settings, emergency_phones: newPhones });
    }
  };

  const updatePhone = (index: number, field: 'label' | 'number', value: string) => {
    if (settings) {
      const newPhones = [...settings.emergency_phones];
      newPhones[index] = { ...newPhones[index], [field]: value };
      setSettings({ ...settings, emergency_phones: newPhones });
    }
  };

  if (!settings) return <div className="p-10 text-center">Cargando configuración...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Configuración General</h2>
          <p className="text-text-secondary">Ajustes de identidad del edificio y contactos de emergencia.</p>
        </div>
        <Button onClick={handleSave} loading={isSaving} className="gap-2">
          <Save className="h-4 w-4" /> Guardar Cambios
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identity Section */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-500" /> Identidad del Edificio
          </h3>
          <Card padding="lg" className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Nombre del Portal</label>
              <input 
                type="text" 
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                className="w-full rounded-[--radius-md] border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Ej: Torre Directorio"
              />
              <p className="text-[10px] text-text-muted italic">Este nombre aparecerá en el Sidebar y en el Header.</p>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Dirección
              </label>
              <input 
                type="text" 
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="w-full rounded-[--radius-md] border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Av. Ejemplo 123"
              />
            </div>
          </Card>

          <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2 pt-4">
            <ShieldCheck className="h-5 w-5 text-primary-500" /> Reglas del SUM
          </h3>
          <Card padding="lg">
            <textarea 
              value={settings.sum_rules}
              onChange={(e) => setSettings({...settings, sum_rules: e.target.value})}
              className="w-full rounded-[--radius-md] border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 h-32 resize-none"
              placeholder="Escribí las reglas generales de convivencia..."
            />
          </Card>
        </div>

        {/* Emergency Contacts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary-500" /> Contactos Útiles
            </h3>
            <button 
              onClick={addPhone}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar Teléfono
            </button>
          </div>
          
          <div className="space-y-3">
            {settings.emergency_phones.map((phone, index) => (
              <Card key={index} padding="md" className="flex items-center gap-4 group">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    value={phone.label}
                    onChange={(e) => updatePhone(index, 'label', e.target.value)}
                    className="bg-transparent border-none p-0 text-sm font-bold text-text-primary focus:ring-0 placeholder:text-text-muted"
                    placeholder="Etiqueta (ej: Ascensores)"
                  />
                  <input 
                    type="text" 
                    value={phone.number}
                    onChange={(e) => updatePhone(index, 'number', e.target.value)}
                    className="bg-transparent border-none p-0 text-sm text-primary-600 font-mono focus:ring-0 placeholder:text-text-muted"
                    placeholder="Número (ej: 0800...)"
                  />
                </div>
                <button 
                  onClick={() => removePhone(index)}
                  className="p-2 text-text-muted hover:text-error-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
