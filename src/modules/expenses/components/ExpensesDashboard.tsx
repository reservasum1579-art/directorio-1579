'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  History, 
  FileText, 
  Download, 
  Filter, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { DashboardCards } from './DashboardCards';
import { ExpenseComparisonChart } from './ExpenseComparisonChart';
import { CategoryRanking } from './CategoryRanking';
import { InsightsPanel } from './InsightsPanel';
import { expensesService } from '../services/expenses.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

type ViewType = 'dashboard' | 'history' | 'detail';

export function ExpensesDashboard() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [periods, setPeriods] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const buildingPeriods = await expensesService.getBuildingExpenses(DEFAULT_BUILDING_ID);
        setPeriods(buildingPeriods);
        
        if (buildingPeriods.length > 0) {
          const mainAnalysis = await expensesService.getExpenseAnalysis(buildingPeriods[0].id);
          setAnalysis(mainAnalysis);
        }

        const history = await expensesService.getHistoricalData();
        setHistoricalData(history);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
        <p className="text-slate-400 font-display text-sm animate-pulse">Analizando liquidaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Header & View Selector */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Análisis de Expensas</h2>
          <p className="text-slate-400 text-sm">Transparencia y evolución financiera del edificio.</p>
        </div>
        
        <div className="flex bg-[#0f172a] p-1 rounded-xl border border-[#d4af37]/10 h-fit self-start">
          <button 
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              view === 'dashboard' ? 'bg-[#d4af37] text-[#0f172a]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button 
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              view === 'history' ? 'bg-[#d4af37] text-[#0f172a]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="h-4 w-4" /> Evolución
          </button>
        </div>
      </header>

      {view === 'dashboard' && (
        <>
          {/* Executive Summary */}
          <DashboardCards analysis={analysis} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Charts & Categories */}
            <div className="lg:col-span-2 space-y-8">
              <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">Distribución Mensual</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Últimos 5 meses</p>
                  </div>
                  <Badge variant="default" className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20 px-3">
                    ARS
                  </Badge>
                </div>
                <ExpenseComparisonChart data={historicalData} type="bar" />
              </Card>

              <CategoryRanking categories={analysis.categories} />
            </div>

            {/* Right: Insights & Periods */}
            <div className="space-y-8">
              <InsightsPanel insights={analysis.insights} />

              <Card padding="none" className="bg-[#0f172a] border-[#d4af37]/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#d4af37]/10 bg-[#d4af37]/5 flex items-center justify-between">
                  <h3 className="font-display font-bold text-white text-xs uppercase tracking-widest">Liquidaciones PDF</h3>
                  <Download className="h-4 w-4 text-[#d4af37]" />
                </div>
                <div className="divide-y divide-[#d4af37]/5">
                  {periods.map((p) => (
                    <div key={p.id} className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-500 group-hover:text-[#d4af37] transition-colors" />
                        <div>
                          <p className="text-sm font-bold text-white capitalize">
                            {new Date(p.year, p.month - 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-slate-500">{formatCurrency(p.total_amount)}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {view === 'history' && (
        <div className="space-y-8">
          <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="font-display font-bold text-white text-xl">Evolución Histórica</h3>
                <p className="text-slate-400 text-sm">Tendencia de gastos ordinarios y extraordinarios.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-[#d4af37]" /> Total
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444] border-2 border-dashed border-white/0" /> Deuda
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <ExpenseComparisonChart data={historicalData} type="line" />
            </div>
          </Card>

          <Card padding="lg" className="bg-[#0f172a] border-[#d4af37]/20">
             <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="font-display font-bold text-white text-xl">Heatmap de Gasto Total</h3>
                <p className="text-slate-400 text-sm">Densidad de costo por período.</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ExpenseComparisonChart data={historicalData} type="area" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
