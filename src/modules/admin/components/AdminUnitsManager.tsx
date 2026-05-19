'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  UserPlus, 
  PawPrint, 
  Car, 
  Users, 
  ChevronRight,
  ShieldCheck,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { unitsAdminService, UnitDetail } from '../services/units.admin.service';

export function AdminUnitsManager() {
  const [units, setUnits] = useState<UnitDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<UnitDetail | null>(null);

  useEffect(() => {
    async function loadUnits() {
      const data = await unitsAdminService.getAllUnits();
      setUnits(data);
      setLoading(false);
    }
    loadUnits();
  }, []);

  const filteredUnits = units.filter(u => 
    `${u.floor}${u.unit}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.occupants.some(occ => occ.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const relationLabels: Record<string, string> = {
    owner: 'Propietario',
    tenant: 'Inquilino',
    family: 'Familiar',
    authorized: 'Autorizado',
  };

  if (loading) return <div className="p-10 text-center">Cargando departamentos...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Departamentos</h2>
          <p className="text-text-secondary">Gestión de unidades funcionales, ocupantes y activos.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Invitar Residente
          </Button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Unidades</p>
            <p className="text-xl font-display font-bold text-text-primary">{units.length}</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-success-500/10 flex items-center justify-center text-success-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Ocupantes</p>
            <p className="text-xl font-display font-bold text-text-primary">
              {units.reduce((acc, u) => acc + u.occupants.length, 0)}
            </p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <PawPrint className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Mascotas</p>
            <p className="text-xl font-display font-bold text-text-primary">
              {units.reduce((acc, u) => acc + u.pets.length, 0)}
            </p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehículos</p>
            <p className="text-xl font-display font-bold text-text-primary">
              {units.reduce((acc, u) => acc + u.vehicles.length, 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Search & Table */}
      <Card padding="none" className="overflow-hidden border-border-light">
        <div className="p-4 border-b border-border-light bg-background-warm/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por unidad o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-warm text-text-muted font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Unidad / UF</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Propietario / Cochera</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredUnits.map(unit => {
                const primary = unit.occupants.find(o => o.is_primary);
                return (
                  <tr key={unit.id} className="hover:bg-background-warm transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-display font-bold text-text-primary block">{unit.floor}{unit.unit}</span>
                      <span className="text-[10px] text-text-muted">UF: {unit.functional_unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={unit.is_active ? 'success' : 'default'}>
                        {unit.is_active ? 'Habitado' : 'Vacío'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {primary ? (
                        <div>
                          <p className="font-bold text-text-primary leading-tight">{primary.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">{relationLabels[primary.relationship]}</p>
                            {unit.parking && (
                              <Badge variant="accent" size="sm" className="bg-blue-500/10 text-blue-600 border-none text-[9px]">
                                <Car className="h-2.5 w-2.5 mr-1" /> {unit.parking}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-text-muted italic text-xs">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedUnit(unit)}
                        className="p-2 hover:bg-primary-50 rounded-lg text-text-muted hover:text-primary-600 transition-all inline-flex items-center gap-1 font-bold text-xs"
                      >
                        Ver Ficha <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal (Simulation) */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in" padding="none">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-primary-600 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Ficha Unidad {selectedUnit.floor}{selectedUnit.unit}</h3>
                  <p className="text-xs text-white/70">Detalle de ocupantes y activos declarados</p>
                </div>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Occupants */}
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary-500" /> Ocupantes ({selectedUnit.occupants.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedUnit.occupants.map((occ, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border-light bg-background-warm/30 flex flex-col gap-2 relative group">
                      {occ.is_primary && <ShieldCheck className="absolute top-4 right-4 h-4 w-4 text-success-500" />}
                      <p className="font-bold text-text-primary">{occ.name}</p>
                      <Badge variant="default" className="w-fit text-[9px] uppercase">{relationLabels[occ.relationship]}</Badge>
                      <div className="space-y-1 mt-2">
                        <p className="text-xs text-text-secondary flex items-center gap-2"><Mail className="h-3 w-3" /> {occ.email}</p>
                        <p className="text-xs text-text-secondary flex items-center gap-2"><Phone className="h-3 w-3" /> {occ.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Pets */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-amber-500" /> Mascotas
                  </h4>
                  {selectedUnit.pets.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUnit.pets.map((pet, i) => (
                        <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">{pet.name}</span>
                          <Badge variant="default" className="text-[9px]">{pet.type}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted italic">No hay mascotas declaradas.</p>
                  )}
                </section>

                {/* Vehicles */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" /> Vehículos
                  </h4>
                  {selectedUnit.vehicles.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUnit.vehicles.map((v, i) => (
                        <div key={i} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                          <p className="text-sm font-bold text-text-primary">{v.brand} {v.model}</p>
                          <p className="text-[10px] font-mono text-primary-600 mt-1 uppercase tracking-wider">{v.plate}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted italic">No hay vehículos declarados.</p>
                  )}
                </section>
              </div>
            </div>

            <div className="px-8 py-4 bg-background-warm border-t border-border flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedUnit(null)}>Cerrar</Button>
              <Button>Editar Ficha</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
