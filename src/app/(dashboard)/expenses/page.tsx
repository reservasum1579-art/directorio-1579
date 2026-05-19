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
  X
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'success'>('form');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setPaymentStep('success');
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      setPaymentStep('form');
      setPaymentFile(null);
    }, 3000);
  };

  // MOCK DATA
  const currentExpense = {
    month: 'Mayo 2026',
    amount: 145200.50,
    dueDate: '2026-05-15',
    status: 'pending', // pending, paid
    unit: '6° C',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  };

  const history = [
    { id: 1, month: 'Abril 2026', amount: 138400.00, status: 'paid', date: '2026-04-10', variation: '+4.5%' },
    { id: 2, month: 'Marzo 2026', amount: 132100.00, status: 'paid', date: '2026-03-12', variation: '+2.8%' },
    { id: 3, month: 'Febrero 2026', amount: 128500.00, status: 'paid', date: '2026-02-08', variation: '-1.2%' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">Expensas de {currentExpense.unit}</h1>
          <p className="text-text-secondary mt-1">Detalle financiero y estado de cuenta de tu unidad.</p>
        </div>
        <div className="flex bg-background-warm p-1 rounded-xl border border-border-light shadow-inner">
          <button 
            onClick={() => setActiveTab('current')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'current' ? 'bg-white shadow-md text-primary-600' : 'text-text-muted hover:text-text-primary'}`}
          >
            Liquidación Actual
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-md text-primary-600' : 'text-text-muted hover:text-text-primary'}`}
          >
            Análisis Histórico
          </button>
        </div>
      </header>

      {activeTab === 'current' ? (
        <div className="space-y-8">
          {/* Top KPIs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-error-200 transition-colors">
                <div className="h-10 w-10 bg-error-500/10 text-error-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Variación</p>
                  <p className="text-sm font-bold text-error-600">+4.8% <span className="text-[10px] font-normal text-text-muted">vs Abril</span></p>
                </div>
             </Card>

             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-primary-200 transition-colors">
                <div className="h-10 w-10 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fondo Reserva</p>
                  <p className="text-sm font-bold text-text-primary">$2.4M <span className="text-[10px] font-normal text-success-600">Sólido</span></p>
                </div>
             </Card>

             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-accent-200 transition-colors">
                <div className="h-10 w-10 bg-accent-500/10 text-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Mayor Gasto</p>
                  <p className="text-sm font-bold text-text-primary truncate">Sueldos 42%</p>
                </div>
             </Card>

             <Card padding="md" className="flex items-center gap-4 bg-surface border-border-light shadow-sm group hover:border-success-200 transition-colors">
                <div className="h-10 w-10 bg-success-500/10 text-success-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Participación</p>
                  <p className="text-sm font-bold text-text-primary">1.45% <span className="text-[10px] font-normal text-text-muted">Cof.</span></p>
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
                      <Badge variant="warning" className="mb-4 animate-pulse px-3 py-1 text-xs">Pago Pendiente</Badge>
                      <h2 className="text-5xl font-display font-black text-text-primary tracking-tight">
                        ${currentExpense.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </h2>
                      <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
                        Liquidación {currentExpense.month} • <span className="text-error-500 font-bold">Vence en 3 días</span>
                      </p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-center min-w-[140px]">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter mb-1">Día de Vencimiento</p>
                      <p className="text-2xl font-black text-error-600">15</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase">Mayo 2026</p>
                    </div>
                  </div>

                  {/* BIG DOWNLOAD BUTTON */}
                  <a 
                    href={currentExpense.pdf_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] shadow-2xl shadow-primary-500/30 transition-all active:scale-[0.97] group"
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
                        className="bg-primary-50 border-primary-100 border-2 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="h-12 w-12 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest mb-0.5">Informar Pago</p>
                          <p className="text-sm font-black text-primary-900 tracking-tight">Subir comprobante</p>
                        </div>
                     </Card>
                  </div>
                </div>
              </Card>

              {/* AI INSIGHTS SECTION */}
              <Card padding="none" className="overflow-hidden border-primary-100 bg-gradient-to-br from-primary-50/50 to-transparent">
                <div className="px-6 py-4 bg-primary-600 text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 animate-pulse" />
                  <h3 className="font-display font-bold text-lg">IA Insights: Análisis del Mes</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="h-6 w-6 bg-error-100 text-error-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">Incremento en Sueldos (+12%)</p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            El aumento principal se debe al acuerdo paritario de SUTERH (Enero/Mayo) que impactó en las cargas sociales y el bono de encargado.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-6 w-6 bg-error-100 text-error-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">Servicios Públicos (+15%)</p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            Ajuste de tarifas de AYSA y Edesur en áreas comunes por quita gradual de subsidios.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="h-6 w-6 bg-success-100 text-success-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <TrendingDown className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">Ahorro en Mantenimiento (-8%)</p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            Se redujeron las intervenciones de emergencia gracias al plan preventivo de ascensores implementado en Marzo.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 px-4 py-3 bg-white rounded-xl border border-primary-100 shadow-sm">
                        <div className="h-6 w-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <ArrowRightCircle className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary-700">Proyección Junio</p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            Se espera estabilidad en los gastos ordinarios. No hay reparaciones mayores planificadas.
                          </p>
                        </div>
                      </div>
                    </div>
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
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="42, 100" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="25, 100" strokeDashoffset="-42" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="33, 100" strokeDashoffset="-67" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-text-primary">100%</span>
                      <span className="text-[8px] font-bold text-text-muted uppercase">Gasto Total</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-text-secondary">Sueldos y Cargas</span>
                      </div>
                      <span className="text-sm font-bold text-text-primary">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium text-text-secondary">Abonos Servicios</span>
                      </div>
                      <span className="text-sm font-bold text-text-primary">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-text-secondary">Reparaciones</span>
                      </div>
                      <span className="text-sm font-bold text-text-primary">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400" />
                        <span className="text-sm font-medium text-text-secondary">Otros</span>
                      </div>
                      <span className="text-sm font-bold text-text-primary">13%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <Card padding="lg" className="bg-primary-900 text-white border-none shadow-xl">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                  <History className="h-5 w-5 text-primary-400" /> Resumen Mayo
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm opacity-90">
                    <span className="font-medium">Ordinarias</span>
                    <span className="font-bold">$125.400,00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm opacity-90">
                    <span className="font-medium">Extraordinarias</span>
                    <span className="font-bold">$12.500,00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-success-400">Reservas SUM</span>
                    <span className="font-bold text-success-400">$7.300,50</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60">Total Final</p>
                      <p className="text-3xl font-black tracking-tighter">$145.200</p>
                    </div>
                    <p className="text-lg font-bold opacity-80 mb-1">,50</p>
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
              <BarChart3 className="h-5 w-5 text-primary-500" /> Evolución de Expensas (6 meses)
            </h3>
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-6 px-4">
               {[
                 { m: 'Nov', v: 45, val: '$112k' },
                 { m: 'Dic', v: 55, val: '$118k' },
                 { m: 'Ene', v: 65, val: '$124k' },
                 { m: 'Feb', v: 60, val: '$128k', down: true },
                 { m: 'Mar', v: 75, val: '$132k' },
                 { m: 'Abr', v: 85, val: '$138k' },
                 { m: 'May', v: 95, val: '$145k', current: true },
               ].map((bar, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="relative w-full flex justify-center">
                     <div 
                       className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 hover:scale-x-110 relative overflow-hidden ${bar.current ? 'bg-primary-600 shadow-neon-primary' : bar.down ? 'bg-success-500' : 'bg-slate-300 group-hover:bg-primary-400'}`}
                       style={{ height: `${bar.v}%` }}
                     >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                     </div>
                     <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-text-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                       {bar.val}
                     </div>
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-tighter ${bar.current ? 'text-primary-600' : 'text-text-muted'}`}>
                     {bar.m}
                   </span>
                 </div>
               ))}
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
                        <button className="p-3 text-primary-600 hover:bg-primary-100 rounded-2xl transition-all shadow-sm bg-primary-50">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <Card className="w-full max-w-md border-primary-500/20 bg-surface shadow-2xl animate-scale-in my-auto" padding="none">
            {paymentStep === 'success' ? (
              <div className="p-10 text-center space-y-4">
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
              <form onSubmit={handlePaymentSubmit}>
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-primary-600 text-white">
                  <div>
                    <h3 className="font-display font-bold text-lg">Informar Pago</h3>
                    <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Unidad {currentExpense.unit}</p>
                  </div>
                  <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-8 space-y-6">
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

                <div className="px-6 py-5 border-t border-white/5 bg-background-warm/50 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !paymentFile} 
                    className="bg-primary-600 hover:bg-primary-700 text-white min-w-[160px] rounded-xl h-12 shadow-lg shadow-primary-500/20"
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
