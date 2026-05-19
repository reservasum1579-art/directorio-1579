'use client';

import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatUnit } from '@/lib/utils';
import type { Profile } from '@/types/global.types';

interface ProfileViewProps {
  profile: Profile | null;
  userUnits: Array<{
    id: string;
    relationship_type: string;
    is_primary: boolean;
    units: { floor: string; unit: string };
  }>;
  userRoles: Array<{
    id: string;
    roles: { name: string; slug: string };
  }>;
}

const relationLabels: Record<string, string> = {
  owner: 'Propietario',
  tenant: 'Inquilino',
  family: 'Familiar',
  authorized: 'Autorizado',
};

export function ProfileView({ profile, userUnits, userRoles }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    show_phone: profile?.show_phone || false,
    show_email: profile?.show_email || false,
  });

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No se encontró el perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 stagger-children">
      {/* Avatar & Name Card */}
      <Card padding="lg" className="text-center">
        <div className="relative inline-block mb-4">
          <Avatar
            src={profile.avatar_url}
            firstName={profile.first_name}
            lastName={profile.last_name}
            size="xl"
          />
          <button
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors cursor-pointer"
            aria-label="Cambiar foto"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <h2 className="font-display text-xl font-semibold text-text-primary">
          {profile.first_name} {profile.last_name}
        </h2>
        <p className="text-sm text-text-secondary mt-1">{profile.email}</p>

        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {userRoles.map((ur) => (
            <Badge key={ur.id} variant="accent">
              {ur.roles.name}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Units Card */}
      <Card padding="lg">
        <CardTitle>Mis departamentos</CardTitle>
        <div className="mt-3 space-y-2">
          {userUnits.length > 0 ? (
            userUnits.map((uu) => (
              <div
                key={uu.id}
                className="flex items-center justify-between py-2 px-3 rounded-[--radius-md] bg-background"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {formatUnit(uu.units.floor, uu.units.unit)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {relationLabels[uu.relationship_type] || uu.relationship_type}
                    </p>
                  </div>
                </div>
                {uu.is_primary && (
                  <Badge variant="success" size="sm">Principal</Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted py-2">
              No tenés departamentos asignados
            </p>
          )}
        </div>
      </Card>

      {/* Edit Profile Card */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Datos personales</CardTitle>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Editar
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
              <Input
                label="Apellido"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              icon={<Phone className="h-4 w-4" />}
              placeholder="+54 11 ..."
            />

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, show_phone: e.target.checked })
                  }
                  className="rounded border-border text-primary-700 focus:ring-primary-500"
                />
                <span className="text-sm text-text-secondary">
                  Mostrar teléfono a vecinos
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_email}
                  onChange={(e) =>
                    setFormData({ ...formData, show_email: e.target.checked })
                  }
                  className="rounded border-border text-primary-700 focus:ring-primary-500"
                />
                <span className="text-sm text-text-secondary">
                  Mostrar email a vecinos
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => setEditing(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                icon={<Save className="h-4 w-4" />}
                className="flex-1"
              >
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2">
              <Mail className="h-4 w-4 text-text-muted shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Email</p>
                <p className="text-sm text-text-primary">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Phone className="h-4 w-4 text-text-muted shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Teléfono</p>
                <p className="text-sm text-text-primary">
                  {profile.phone || 'No configurado'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
