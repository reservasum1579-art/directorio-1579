'use client';

import { 
  Check, 
  X, 
  Phone, 
  Home, 
  DollarSign, 
  ExternalLink, 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  TrendingUp,
  Users,
  CalendarCheck,
  Settings,
  Download,
  History,
  Info
} from 'lucide-react';
import type { SumReservation } from '../types/sum.types';
import { sumService } from '../services/sum.service';
import { useState, useMemo } from 'react';
import { formatShortDate, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AdminSumDashboardProps {
  initialPending: SumReservation[];
}

export function AdminSumDashboard({ initialPending }: AdminSumDashboardProps) {
  const [reservations, setReservations] = useState<any[]>(initialPending);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [prices, setPrices] = useState({ morning: 3000, night: 5000 });

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesSearch = 
        `${res.profiles?.first_name} ${res.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${res.units?.floor}${res.units?.unit}`.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [reservations, searchTerm]);

  // KPI Calculations
  const stats = {
    totalMonth: reservations.filter(r => r.status === 'approved').length,
    revenue: reservations.filter(r => r.status === 'approved').reduce((acc, r) => acc + (r.price || 0), 0),
    historicalRevenue: [
      { month: 'Abril', amount: 45000 },
      { month: 'Marzo', amount: 38000 },
      { month: 'Febrero', amount: 52000 },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl font-black text-text-primary tracking-tight">
            Gestión Financiera SUM
          </h2>
          <p className="text-text-secondary mt-1 text-lg">
            Control de recaudación y configuración de tarifas para el edificio.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsPriceModalOpen(true)}
            className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest border-primary-200 text-primary-700 hover:bg-primary-50"
          >
            <Settings className="h-4 w-4 mr-2" /> Ajustar Tarifas
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20">
            <Download className="h-4 w-4 mr-2" /> Exportar para Expensas
          </Button>
        </div>
      </header>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="bg-primary-600 text-white border-none shadow-xl shadow-primary-500/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Recaudado Mayo</p>
              <p className="text-3xl font-black">${stats.revenue.toLocaleString('es-AR')}</p>
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-surface border-border-light group hover:border-primary-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Reservas</p>
              <p className="text-2xl font-black text-text-primary">{stats.totalMonth}</p>
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-surface border-border-light">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Valor Mañana</p>
              <p className="text-2xl font-black text-text-primary">${prices.morning.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-surface border-border-light">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Valor Noche</p>
              <p className="text-2xl font-black text-text-primary">${prices.night.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List: Liquidación de Reservas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" /> Detalle para Liquidación
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Buscar vecino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface border border-border-light rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <Card padding="none" className="overflow-hidden border-border-light shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-background-warm border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Vecino / Unidad</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Fecha / Turno</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Monto a Cobrar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredReservations.map((res: any) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                          {res.profiles?.first_name?.charAt(0)}{res.profiles?.last_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{res.profiles?.first_name} {res.profiles?.last_name}</p>
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">Depto {res.units?.floor}{res.units?.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-sm font-bold text-text-primary">{formatShortDate(res.reservation_date)}</p>
                      <Badge variant="default" className="text-[9px] uppercase tracking-tighter">
                        {res.shift_type === 'day' ? 'Mañana' : 'Noche'}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-lg font-black text-primary-700 tracking-tight">${res.price?.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-success-600 uppercase">Auto-aprobado</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Sidebar: Históricos Financieros */}
        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
            <History className="h-5 w-5 text-accent-500" /> Histórico Mensual
          </h3>
          <div className="space-y-4">
            {stats.historicalRevenue.map((item, i) => (
              <Card key={i} padding="md" className="flex items-center justify-between border-border-light hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-black text-text-muted uppercase tracking-widest">{item.month}</p>
                  <p className="text-sm font-bold text-text-primary mt-0.5">Recaudación Total</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-text-primary">${item.amount.toLocaleString()}</p>
                  <Badge variant="success" className="text-[9px] px-2">Liquidado</Badge>
                </div>
              </Card>
            ))}

            <Card padding="lg" className="bg-info-500/5 border-info-500/20">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-info-600 shrink-0" />
                <p className="text-xs text-info-700 leading-relaxed font-medium">
                  El sistema bloquea automáticamente a vecinos con <span className="font-bold">2 o más expensas vencidas</span>. No es necesaria la aprobación manual de reservas.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Ajustar Tarifas */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-sm border-primary-500/20 bg-surface shadow-2xl animate-scale-in" padding="none">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-primary-600 text-white">
              <h3 className="font-display font-bold text-lg">Ajustar Tarifas SUM</h3>
              <button onClick={() => setIsPriceModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Precio Turno Mañana</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input 
                    type="number" 
                    value={prices.morning}
                    onChange={(e) => setPrices({...prices, morning: parseInt(e.target.value)})}
                    className="w-full bg-background border border-border-light rounded-xl pl-10 pr-4 py-3 text-lg font-black text-text-primary focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Precio Turno Noche</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input 
                    type="number" 
                    value={prices.night}
                    onChange={(e) => setPrices({...prices, night: parseInt(e.target.value)})}
                    className="w-full bg-background border border-border-light rounded-xl pl-10 pr-4 py-3 text-lg font-black text-text-primary focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-white/5 bg-background-warm/50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsPriceModalOpen(false)}>Cancelar</Button>
              <Button 
                onClick={() => setIsPriceModalOpen(false)} 
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 rounded-xl font-black text-xs uppercase"
              >
                Actualizar Precios
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
