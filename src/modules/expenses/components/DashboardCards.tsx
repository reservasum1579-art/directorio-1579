'use client';

import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Users, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface DashboardCardsProps {
  analysis: {
    total_amount: number;
    previous_total: number;
    variation_percent: number;
    total_debt_building: number;
    delinquent_units_count: number;
    top_category_name?: string;
  };
}

export function DashboardCards({ analysis }: DashboardCardsProps) {
  const isUp = analysis.variation_percent > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Liquidación */}
      <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-[#d4af37]/10 transition-all" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Total Liquidación</p>
            <div className="p-2 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(analysis.total_amount)}</h3>
          <div className="flex items-center gap-1.5">
            {isUp ? (
              <TrendingUp className="h-3 w-3 text-red-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-emerald-400" />
            )}
            <span className={`text-xs font-medium ${isUp ? 'text-red-400' : 'text-emerald-400'}`}>
              {isUp ? '+' : ''}{analysis.variation_percent}% vs mes anterior
            </span>
          </div>
        </div>
      </Card>

      {/* Deuda Total Edificio */}
      <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Deuda Total</p>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(analysis.total_debt_building)}</h3>
          <p className="text-xs text-slate-400">
            Acumulado de períodos anteriores
          </p>
        </div>
      </Card>

      {/* Unidades Morosas */}
      <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Unidades Morosas</p>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{analysis.delinquent_units_count}</h3>
          <p className="text-xs text-slate-400">
            Departamentos con deuda pendiente
          </p>
        </div>
      </Card>

      {/* Mayor Gasto */}
      <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Mayor Gasto</p>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1 truncate">{analysis.top_category_name || 'Sueldos'}</h3>
          <p className="text-xs text-slate-400">
            Categoría con mayor incidencia
          </p>
        </div>
      </Card>
    </div>
  );
}
