'use client';

import { 
  FileText, 
  Download, 
  CreditCard, 
  History, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Upload,
  TrendingUp,
  TrendingDown,
  PieChart,
  Users,
  ShieldCheck,
  Zap,
  BarChart3,
  Lightbulb,
  ArrowRightCircle,
  Clock,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

import { submitExpensePaymentAction } from '../actions/expenses.actions';
import { createClient } from '@/lib/supabase/client';

interface ExpensesBoardProps {
  unitsData: {
    currentExpense: any;
    history: any[];
    unit: any;
  }[];
}

export function ExpensesBoard({ unitsData }: ExpensesBoardProps) {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'success'>('form');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const { currentExpense, history, unit } = unitsData[selectedUnitIndex];

  const getDueStatusText = () => {
    if (currentExpense.status !== 'pending') return 'Pagado';
    if (!currentExpense.dueDate) return 'Pago Pendiente';

    try {
      let dueStr = currentExpense.dueDate;
      if (dueStr.includes('de')) {
        return `Vence el ${dueStr}`;
      }

      const dueDate = new Date(dueStr + 'T23:59:59');
      const today = new Date();
      
      today.setHours(0,0,0,0);
      const dueCompare = new Date(dueDate);
      dueCompare.setHours(0,0,0,0);

      const diffTime = dueCompare.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return `Vencido hace ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'día' : 'días'}`;
      } else if (diffDays === 0) {
        return 'Vence hoy';
      } else if (diffDays === 1) {
        return 'Vence mañana';
      } else {
        return `Vence en ${diffDays} días`;
      }
    } catch (e) {
      return 'Pago Pendiente';
    }
  };

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('de')) return dateStr;
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}/${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFile || !currentExpense) return;
    
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      const fileExt = paymentFile.name.split('.').pop();
      const fileName = `${unit.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir archivo al bucket
      const { error: uploadError } = await supabase.storage
        .from('expense-receipts')
        .upload(filePath, paymentFile);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('expense-receipts')
        .getPublicUrl(filePath);

      // 3. Crear el registro en la DB
      const result = await submitExpensePaymentAction(
        unit.id, 
        currentExpense.id, 
        currentExpense.amount, 
        publicUrl
      );

      if (!result.success) throw new Error(result.error);

      setPaymentStep('success');
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentStep('form');
        setPaymentFile(null);
      }, 3000);
    } catch (error) {
      console.error('Payment submit error:', error);
      alert('Error al subir el comprobante. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">Expensas de {currentExpense.unit}</h1>
            <p className="text-text-secondary mt-1">Detalle financiero y estado de cuenta de tu unidad.</p>
          </div>
          {unitsData.length > 1 && (
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner w-fit">
              {unitsData.map((data, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUnitIndex(index)}
                  className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedUnitIndex === index
                      ? 'bg-emerald-900 shadow-sm text-emerald-50'
                      : 'text-slate-500 hover:text-emerald-900'
                  }`}
                >
                  {data.unit.name.toLowerCase().includes('cochera') ? '🚗' : '🏢'} {data.unit.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('current')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'current' ? 'bg-emerald-900 shadow-md text-emerald-50' : 'text-slate-500 hover:text-emerald-900'}`}
          >
            Liquidación Actual
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-emerald-900 shadow-md text-emerald-50' : 'text-slate-500 hover:text-emerald-900'}`}
          >
            Análisis Histórico
          </button>
        </div>
      </header>

      {activeTab === 'current' ? (
        <div className="space-y-8">
          {/* Top KPIs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* KPI 1: Variación respecto al mes anterior */}
             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-error-200 transition-colors">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${history[0]?.variation?.startsWith('-') ? 'bg-success-500/10 text-success-500' : 'bg-error-500/10 text-error-500'}`}>
                  {history[0]?.variation?.startsWith('-') ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Variación</p>
                  <p className={`text-sm font-bold ${history[0]?.variation?.startsWith('-') ? 'text-success-600' : 'text-error-600'}`}>
                    {history[0]?.variation || '—'} <span className="text-[10px] font-normal text-text-muted">vs Anterior</span>
                  </p>
                </div>
             </Card>

             {/* KPI 2: Fondo de Reserva con variación */}
             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-primary-200 transition-colors">
                <div className="h-10 w-10 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fondo Reserva</p>
                  {currentExpense.reserve_fund > 0 ? (
                    <p className="text-sm font-bold text-text-primary">
                      ${(currentExpense.reserve_fund / 1000000).toFixed(1)}M{' '}
                      <span className={`text-[10px] font-bold ${currentExpense.reserve_fund_variation?.startsWith('-') ? 'text-error-500' : currentExpense.reserve_fund_variation === '0%' ? 'text-text-muted' : 'text-success-600'}`}>
                        {currentExpense.reserve_fund_variation !== '0%' ? currentExpense.reserve_fund_variation : '—'}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-text-muted">Sin datos</p>
                  )}
                </div>
             </Card>

             {/* KPI 3: Próximo vencimiento */}
             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-warning-200 transition-colors">
                <div className="h-10 w-10 bg-warning-500/10 text-warning-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Vencimiento</p>
                  <p className="text-sm font-bold text-text-primary truncate">{formatDueDate(currentExpense.dueDate)}</p>
                </div>
             </Card>

             {/* KPI 4: Participación del departamento */}
             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-success-200 transition-colors">
                <div className="h-10 w-10 bg-success-500/10 text-success-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Participación</p>
                  <p className="text-sm font-bold text-text-primary">
                    {currentExpense.total_expenses > 0
                      ? `${((currentExpense.amount / currentExpense.total_expenses) * 100).toFixed(2)}%`
                      : '—'}
                    {' '}<span className="text-[10px] font-normal text-text-muted">Cof.</span>
                  </p>
                </div>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card padding="none" className="overflow-hidden border-none shadow-2xl relative">
                <div className="absolute top-0 left-0 w-1.5 bg-warning-500 h-full" />
                <div className="p-8 bg-gradient-to-br from-surface to-background-warm">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                    <div>
                      <Badge variant={currentExpense.status === 'pending' ? 'warning' : 'success'} className="mb-4 px-3 py-1 text-xs">
                        {currentExpense.status === 'pending' ? 'Pago Pendiente' : 'Al Día'}
                      </Badge>
                      <h2 className="text-5xl font-display font-black text-text-primary tracking-tight">
                        ${currentExpense.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </h2>
                      <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
                        Liquidación {currentExpense.month} • <span className={currentExpense.status === 'pending' ? "text-error-500 font-bold" : "text-success-500 font-bold"}>
                          {getDueStatusText()}
                        </span>
                      </p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-center min-w-[140px]">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter mb-1">Día de Vencimiento</p>
                      <p className="text-2xl font-black text-error-600">{formatDueDate(currentExpense.dueDate)}</p>
                    </div>
                  </div>

                  {/* BIG DOWNLOAD BUTTON */}
                  <a 
                    href={currentExpense.pdf_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-emerald-900 hover:bg-emerald-950 text-emerald-50 rounded-[2rem] shadow-2xl shadow-emerald-900/30 transition-all active:scale-[0.97] group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <FileText className="h-10 w-10" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-2xl tracking-tight leading-tight">Descargar Expensa</p>
                        <p className="text-sm opacity-80 font-medium">Liquidación Detallada (PDF)</p>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-y-1 transition-transform">
                      <Download className="h-6 w-6" />
                    </div>
                  </a>

                  {/* Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                     <Card padding="md" className="bg-white/50 backdrop-blur-sm border-white border-2 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-12 w-12 bg-info-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-info-500/20">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Transferencia CBU</p>
                          <p className="text-sm font-black text-text-primary tracking-tight">consorcio.directorio.1579</p>
                        </div>
                     </Card>
                     <Card 
                        padding="md" 
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="bg-emerald-50 border-emerald-100 border-2 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="h-12 w-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-700/20 group-hover:scale-110 transition-transform">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-0.5">Informar Pago</p>
                          <p className="text-sm font-black text-emerald-950 tracking-tight">Subir comprobante</p>
                        </div>
                     </Card>
                  </div>
                </div>
              </Card>

              {/* AI INSIGHTS SECTION */}
              <Card padding="none" className="overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-transparent">
                <div className="px-6 py-4 bg-emerald-900 text-emerald-50 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 animate-pulse" />
                  <h3 className="font-display font-bold text-lg">IA Insights: Análisis del Mes</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="text-sm text-text-secondary leading-relaxed space-y-4">
                    {currentExpense.insights.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Composition Chart Simulation */}
              <Card padding="lg">
                <h3 className="font-display font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-accent-500" /> Distribución del Gasto
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="relative h-40 w-40 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      {(() => {
                        let offset = 0;
                        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#94a3b8', '#14b8a6', '#f97316'];
                        return currentExpense.categories.map((cat: any, i: number) => {
                          const percentage = Number(cat.percentage);
                          const currentOffset = offset;
                          offset -= percentage;
                          
                          if (percentage <= 0) return null;
                          
                          return (
                            <path 
                              key={i}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke={colors[i % colors.length]} 
                              strokeWidth="3" 
                              strokeDasharray={`${percentage}, 100`} 
                              strokeDashoffset={currentOffset === 0 ? undefined : currentOffset} 
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-text-primary">100%</span>
                      <span className="text-[8px] font-bold text-text-muted uppercase">Gasto Total</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 w-full">
                    {currentExpense.categories.map((cat: any, i: number) => {
                      const colors = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-slate-400', 'bg-teal-500', 'bg-orange-500'];
                      const color = colors[i % colors.length];
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <span className="text-sm font-medium text-text-secondary max-w-[150px] truncate">{cat.category_name}</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary">{Number(cat.percentage).toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <Card padding="lg" className="bg-slate-900 text-white border-none shadow-xl">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                  <History className="h-5 w-5 text-emerald-400" /> Resumen General
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm opacity-90">
                    <span className="font-medium">Ordinarias</span>
                    <span className="font-bold">${currentExpense.ordinary_expenses.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm opacity-90">
                    <span className="font-medium">Extraordinarias</span>
                    <span className="font-bold">${currentExpense.extraordinary_expenses.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-success-400">Reservas</span>
                    <span className="font-bold text-success-400">${currentExpense.reserve_fund.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60">Total Edificio</p>
                      <p className="text-3xl font-black tracking-tighter">${currentExpense.total_expenses.toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="border-border-light shadow-sm bg-background-warm/30">
                <h4 className="text-sm font-black text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning-500" /> Ahorro Proyectado
                </h4>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-success-500 rounded-full w-[85%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                  <p className="text-[10px] text-text-muted font-bold text-right italic">Bajo Presupuesto (15% Ahorro)</p>
                </div>
              </Card>

              <div className="p-5 bg-surface rounded-2xl border border-border-light flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer">
                <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:rotate-6 transition-transform">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSwWmfUu3Pw4xRc2tapDLN86_g_jbGEIkQp3t4TMPF2K343KmAd6tJCl1U2nvnQDt4hrhTQ01G_NCF8uYsfqLeBh9XBzrZx6I8wvFeTqfRse0u3-hqAhEsvfZgfxmW_zCY85ni-X-vS9EOq4erjRBiirMWNcuTkHYF19gp20fdyz9ovmUo4vPA6jELmkvjBcQmlfEfuY27L28QrUzYqToKgr27rm7KyjDs6gfis9FaLOxt_xJ8qjZ9Sw_1m-7TjmW-VK3ljWGBTszD" alt="Admin" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Administrador</p>
                  <p className="text-sm font-black text-text-primary truncate">Alex Sterling</p>
                </div>
                <div className="ml-auto bg-slate-100 p-2 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Historical Evolution Chart Simulation */}
          <Card padding="lg">
            <h3 className="font-display font-bold text-lg text-text-primary mb-8 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" /> Evolución de Expensas (6 meses)
            </h3>
            <div className="flex h-72 w-full gap-2">
              {/* Y-axis Reference */}
              {(() => {
                const maxVal = Math.max(...history.map(h => h.amount), 1);
                return (
                  <div className="flex flex-col justify-between items-end text-[10px] font-bold text-text-muted pb-8 pr-2 border-r border-border-light h-full w-16 shrink-0">
                    <span>${maxVal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <span>${(maxVal / 2).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <span>$0</span>
                  </div>
                );
              })()}
              
              <div className="h-full w-full flex items-end justify-between gap-2 sm:gap-6 px-2 pb-8 relative">
                 {history.slice(0).reverse().map((item, i) => {
                   const maxVal = Math.max(...history.map(h => h.amount), 1);
                   const heightPct = Math.max(10, (item.amount / maxVal) * 100);
                   const isDown = parseFloat(item.variation) < 0;
                   return (
                   <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-3 group relative">
                     <div className="relative w-full h-full flex justify-center items-end">
                       <div className="absolute -top-6 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-[11px] font-black whitespace-nowrap z-10">
                         ${item.amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                       </div>
                       <div 
                         className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 hover:scale-x-110 relative overflow-hidden ${i === history.length - 1 ? 'bg-emerald-700 shadow-[0_0_15px_rgba(4,120,87,0.5)]' : isDown ? 'bg-emerald-400' : 'bg-slate-300 group-hover:bg-emerald-500'}`}
                         style={{ height: `${heightPct}%` }}
                       >
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                       </div>
                     </div>
                     <span className={`absolute -bottom-8 text-[10px] font-black uppercase tracking-tighter ${i === history.length - 1 ? 'text-emerald-800' : 'text-slate-500'}`}>
                       {item.shortMonth}
                     </span>
                   </div>
                 )})}
              </div>
            </div>
          </Card>

          {/* Historical Table */}
          <Card padding="none" className="overflow-hidden border-border-light shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-warm border-b border-border-light">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Período</th>
                    <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Monto</th>
                    <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Variación</th>
                    <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Estado</th>
                    <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                         <p className="font-black text-text-primary">{item.month}</p>
                         <p className="text-[10px] text-text-muted font-bold">Pago: {new Date(item.date).toLocaleDateString('es-AR')}</p>
                      </td>
                      <td className="px-6 py-5 text-center font-black text-text-primary text-sm tracking-tight">
                        ${item.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-xs font-black ${item.variation.startsWith('+') ? 'text-error-500' : 'text-success-500'}`}>
                          {item.variation}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center">
                          <Badge variant="success" className="gap-1.5 px-3 py-1 font-bold">
                            <CheckCircle2 className="h-3 w-3" /> PAGADO
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-3 text-emerald-700 hover:bg-emerald-100 rounded-2xl transition-all shadow-sm bg-emerald-50">
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Informar Pago */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md border-primary-500/20 bg-surface shadow-2xl animate-scale-in max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden" padding="none">
            {paymentStep === 'success' ? (
              <div className="p-10 text-center space-y-4 overflow-y-auto flex-grow">
                <div className="h-20 w-20 bg-success-500/10 text-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white">¡Comprobante Recibido!</h3>
                <p className="text-text-secondary text-sm">
                  Hemos recibido tu comprobante de <span className="text-primary-400 font-bold">${currentExpense.amount.toLocaleString('es-AR')}</span>. 
                  Se acreditará en tu cuenta en las próximas 48hs hábiles.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="flex flex-col flex-grow overflow-hidden">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-emerald-900 text-white shrink-0">
                  <div>
                    <h3 className="font-display font-bold text-lg">Informar Pago</h3>
                    <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Unidad {currentExpense.unit}</p>
                  </div>
                  <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto flex-grow">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Monto Informado</label>
                    <div className="text-2xl font-black text-text-primary bg-background-warm p-4 rounded-xl border border-border-light">
                      ${currentExpense.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Subir Comprobante</label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-200 rounded-3xl cursor-pointer hover:bg-primary-50 hover:border-primary-500 transition-all group overflow-hidden">
                      {paymentFile ? (
                        <div className="flex flex-col items-center gap-2">
                           <CheckCircle2 className="h-10 w-10 text-success-500" />
                           <p className="text-xs font-bold text-text-primary">{paymentFile.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-xs text-text-muted font-bold">Hacé clic o arrastrá el archivo</p>
                          <p className="text-[10px] text-text-muted/60 mt-1 uppercase">PDF, JPG o PNG</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} 
                      />
                    </label>
                  </div>

                  <div className="bg-info-500/5 border border-info-500/10 p-4 rounded-2xl flex gap-3">
                    <AlertCircle className="h-5 w-5 text-info-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-info-700 font-medium leading-relaxed">
                      Tu pago será verificado por la administración. Una vez confirmado, verás el estado actualizado en tu historial.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-white/5 bg-background-warm/50 flex justify-end gap-3 shrink-0">
                  <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !paymentFile} 
                    className="bg-emerald-700 hover:bg-emerald-800 text-white min-w-[160px] rounded-xl h-12 shadow-lg shadow-emerald-700/20"
                  >
                    {isSubmitting ? 'Verificando...' : 'Informar Pago'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
