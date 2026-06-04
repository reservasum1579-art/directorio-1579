'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, Home, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';

const BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || '';
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUnit, setNewUnit] = useState({ floor: '', unit_number: '', coefficient: '1.5' });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: u }, { data: p }] = await Promise.all([
      supabase.from('units').select('*').eq('building_id', BUILDING_ID).order('floor').order('unit_number'),
      supabase.from('profiles').select('id, full_name, email, unit_id, garage_id, floor, unit')
    ]);
    setUnits(u || []);
    setProfiles(p || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const createUnit = async () => {
    if (!newUnit.floor || !newUnit.unit_number) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('units').insert({
      building_id: BUILDING_ID,
      floor: newUnit.floor,
      unit_number: newUnit.unit_number,
      coefficient: parseFloat(newUnit.coefficient)
    });
    setNewUnit({ floor: '', unit_number: '', coefficient: '1.5' });
    setIsAdding(false);
    await loadData();
    setSaving(false);
  };

  const assignUnit = async (profileId: string, unitId: string | null) => {
    const supabase = createClient();
    await supabase.from('profiles').update({ unit_id: unitId }).eq('id', profileId);
    await loadData();
  };

  const assignGarage = async (profileId: string, garageId: string | null) => {
    const supabase = createClient();
    await supabase.from('profiles').update({ garage_id: garageId }).eq('id', profileId);
    await loadData();
  };

  const filteredProfiles = profiles.filter(p =>
    (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const getUnitLabel = (unitId: string | null) => {
    if (!unitId) return null;
    const u = units.find(u => u.id === unitId);
    return u ? `${u.floor}° ${u.unit_number}` : null;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <header>
        <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Unidades Funcionales</h2>
        <p className="text-text-secondary">Gestión de departamentos y asignación a propietarios.</p>
      </header>

      {/* Departments grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Units list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2"><Home className="h-5 w-5 text-primary-500" /> Departamentos ({units.length})</h3>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Nuevo
            </button>
          </div>

          {isAdding && (
            <Card padding="md" className="border-primary-200 bg-primary-50/30 space-y-3">
              <p className="font-bold text-sm text-primary-700">Nuevo Departamento</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Piso</label>
                  <input
                    type="text" placeholder="Ej: 6"
                    value={newUnit.floor}
                    onChange={e => setNewUnit(p => ({ ...p, floor: e.target.value }))}
                    className="w-full mt-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Unidad</label>
                  <input
                    type="text" placeholder="Ej: C"
                    value={newUnit.unit_number}
                    onChange={e => setNewUnit(p => ({ ...p, unit_number: e.target.value }))}
                    className="w-full mt-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Coef. %</label>
                  <input
                    type="number" step="0.01" placeholder="Ej: 1.5"
                    value={newUnit.coefficient}
                    onChange={e => setNewUnit(p => ({ ...p, coefficient: e.target.value }))}
                    className="w-full mt-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text-primary">Cancelar</button>
                <button
                  onClick={createUnit}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  Guardar
                </button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {units.map(u => {
              const owner = profiles.find(p => p.unit_id === u.id);
              return (
                <Card key={u.id} padding="md" className="border-border-light hover:border-primary-200 transition-colors text-center">
                  <p className="text-2xl font-black text-text-primary">{u.floor}°{u.unit_number}</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase mt-1">Coef: {u.coefficient}%</p>
                  {owner ? (
                    <Badge variant="success" className="mt-2 text-[10px] truncate max-w-full">{owner.full_name || owner.email}</Badge>
                  ) : (
                    <Badge variant="default" className="mt-2 text-[10px]">Sin asignar a Depto</Badge>
                  )}
                  {(() => {
                    const garageOwner = profiles.find(p => p.garage_id === u.id);
                    if (garageOwner) {
                      return <Badge variant="default" className="mt-1 text-[10px] truncate max-w-full bg-accent-100 text-accent-700">{garageOwner.full_name || garageOwner.email} (Cochera)</Badge>;
                    }
                    return null;
                  })()}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Profiles assignment */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><Users className="h-5 w-5 text-accent-500" /> Asignar Propietarios</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text" placeholder="Buscar por nombre o email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-border-light rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredProfiles.map(p => (
              <Card key={p.id} padding="md" className="border-border-light">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-text-primary truncate">{p.full_name || 'Sin nombre'}</p>
                    <p className="text-[11px] text-text-muted truncate">{p.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-text-muted w-12">Unidad:</span>
                      <select
                        value={p.unit_id || ''}
                        onChange={e => assignUnit(p.id, e.target.value || null)}
                        className="w-28 border border-border-light rounded-lg px-2 py-1 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Ninguna</option>
                        {units.map(u => (
                          <option key={u.id} value={u.id}>{u.floor}° {u.unit_number}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-text-muted w-12">Cochera:</span>
                      <select
                        value={p.garage_id || ''}
                        onChange={e => assignGarage(p.id, e.target.value || null)}
                        className="w-28 border border-border-light rounded-lg px-2 py-1 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">Ninguna</option>
                        {units.map(u => (
                          <option key={u.id} value={u.id}>{u.floor}° {u.unit_number}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {(p.unit_id || p.garage_id) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {p.unit_id && (
                      <div className="flex items-center gap-2 bg-success-50 border border-success-200 text-success-700 px-2 py-1 rounded-md">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[10px] font-bold">Dpto {getUnitLabel(p.unit_id)}</span>
                        <button onClick={() => assignUnit(p.id, null)} className="ml-1 text-success-700/50 hover:text-success-700">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {p.garage_id && (
                      <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 text-accent-700 px-2 py-1 rounded-md">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[10px] font-bold">Cochera {getUnitLabel(p.garage_id)}</span>
                        <button onClick={() => assignGarage(p.id, null)} className="ml-1 text-accent-700/50 hover:text-accent-700">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
