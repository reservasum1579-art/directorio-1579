'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Download, 
  Eye,
  Check,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { expensesService } from '../services/expenses.service';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';

import { ExpenseUploadModal } from './ExpenseUploadModal';

export function AdminExpensesManager() {
  const [periods, setPeriods] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const buildingPeriods = await expensesService.getBuildingExpenses(DEFAULT_BUILDING_ID);
        setPeriods(buildingPeriods);
        if (buildingPeriods.length > 0) {
          setSelectedPeriod(buildingPeriods[0]);
          const periodDetails = await expensesService.getExpenseDetails(buildingPeriods[0].id);
          setDetails(periodDetails);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePeriodChange = async (period: any) => {
    setLoading(true);
    setSelectedPeriod(period);
    try {
      const periodDetails = await expensesService.getExpenseDetails(period.id);
      setDetails(periodDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await expensesService.verifyPayment(id);
      setDetails(prev => prev.map(d => d.id === id ? { ...d, status: 'paid', payment_date: new Date().toISOString() } : d));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadSuccess = () => {
    // In a real app, we would re-fetch. 
    // For the demo, we'll just log and let the user see the success state of the modal.
    console.log('Nueva liquidación procesada correctamente.');
  };

  const filteredDetails = details.filter(d => 
    `${d.units?.floor}${d.units?.unit}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = details.filter(d => d.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = details.filter(d => d.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const collectionPercent = (totalCollected / (totalCollected + totalPending || 1)) * 100;

  if (!selectedPeriod) return <div className="p-10 text-center">Cargando gestión de expensas...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Gestión de Expensas</h2>
          <p className="text-text-secondary">Control de cobranzas y publicación de liquidaciones mensuales.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20 active:scale-95"
        >
          <Upload className="h-5 w-5" /> Nueva Liquidación
        </button>
      </header>

      <ExpenseUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" className="bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">Recaudación Total</p>
              <h4 className="text-2xl font-bold text-text-primary">{formatCurrency(totalCollected)}</h4>
              <p className="text-xs text-text-muted mt-2">
                <span className="text-success-500 font-bold">{collectionPercent.toFixed(1)}%</span> del total facturado
              </p>
            </div>
            <div className="p-3 bg-primary-500/20 rounded-xl text-primary-500">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
              style={{ width: `${collectionPercent}%` }}
            />
          </div>
        </Card>

        <Card padding="lg" className="border-warning-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-warning-400 uppercase tracking-widest mb-1">Pendiente de Cobro</p>
              <h4 className="text-2xl font-bold text-text-primary">{formatCurrency(totalPending)}</h4>
              <p className="text-xs text-text-muted mt-2">
                {details.filter(d => d.status === 'pending').length} departamentos con deuda
              </p>
            </div>
            <div className="p-3 bg-warning-500/20 rounded-xl text-warning-500">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card padding="lg" className="border-info-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-info-400 uppercase tracking-widest mb-1">Vencimiento</p>
              <h4 className="text-2xl font-bold text-text-primary">{formatShortDate(selectedPeriod.due_date)}</h4>
              <p className="text-xs text-text-muted mt-2">
                Mes de {new Date(selectedPeriod.year, selectedPeriod.month - 1).toLocaleDateString('es-AR', { month: 'long' })}
              </p>
            </div>
            <div className="p-3 bg-info-500/20 rounded-xl text-info-500">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Periods */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2 px-1">
            <FileText className="h-5 w-5 text-primary-500" /> Períodos
          </h3>
          <div className="space-y-2">
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => handlePeriodChange(p)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedPeriod.id === p.id 
                    ? 'bg-primary-500/10 border-primary-500/30 ring-1 ring-primary-500/20' 
                    : 'bg-surface border-white/5 hover:border-white/10 text-text-muted hover:text-text-primary'
                }`}
              >
                <p className="font-bold capitalize">{new Date(p.year, p.month - 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</p>
                <p className="text-[10px] uppercase font-bold tracking-tighter opacity-60">Total: {formatCurrency(p.total_amount)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* List of Units */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Buscar unidad (ej: 14B)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="default" className="px-3 py-1.5">{details.length} Unidades</Badge>
              <button className="p-2 bg-surface border border-white/5 rounded-xl text-text-muted hover:text-text-primary transition-all">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Card padding="none" className="overflow-hidden border-white/5 bg-surface/50 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-text-muted tracking-widest text-left">
                    <th className="px-6 py-4">Unidad</th>
                    <th className="px-6 py-4">Monto</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDetails.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-surface-bright flex items-center justify-center text-xs font-bold text-text-muted border border-white/5">
                            {d.units?.floor}{d.units?.unit}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">Dpto {d.units?.floor}{d.units?.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-text-primary">{formatCurrency(d.amount)}</p>
                      </td>
                      <td className="px-6 py-4">
                        {d.status === 'paid' ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge variant="success" className="w-fit gap-1 text-[10px]">
                              <CheckCircle2 className="h-3 w-3" /> Pagado
                            </Badge>
                            {d.payment_date && <span className="text-[9px] text-text-muted pl-1">{formatShortDate(d.payment_date)}</span>}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <Badge variant="warning" className="w-fit gap-1 text-[10px]">
                              <Clock className="h-3 w-3" /> Pendiente
                            </Badge>
                            {d.payment_proof_url && (
                              <a 
                                href={d.payment_proof_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[9px] text-primary-400 hover:underline flex items-center gap-1 pl-1"
                              >
                                <Eye className="h-2.5 w-2.5" /> Ver Comprobante
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.status === 'pending' && (
                            <button 
                              onClick={() => handleVerify(d.id)}
                              className="bg-success-600/10 hover:bg-success-600/20 text-success-500 border border-success-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <Check className="h-3.5 w-3.5" /> Confirmar Pago
                            </button>
                          )}
                          <button className="p-2 text-text-muted hover:text-text-primary transition-all">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
