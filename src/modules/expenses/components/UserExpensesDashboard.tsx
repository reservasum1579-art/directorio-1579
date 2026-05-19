'use client';

import { useState, useEffect } from 'react';
import { Download, FileUp, AlertTriangle, CheckCircle, Receipt, ArrowRight } from 'lucide-react';
import { expensesService } from '../services/expenses.service';
import type { UnitExpense } from '../types/expenses.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatShortDate, formatUnit } from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/Spinner';

interface UserExpensesDashboardProps {
  userUnits: Array<{
    unit_id: string;
    units: { floor: string; unit: string };
  }>;
}

export function UserExpensesDashboard({ userUnits }: UserExpensesDashboardProps) {
  const [selectedUnit, setSelectedUnit] = useState(userUnits[0]?.unit_id || '');
  const [expenses, setExpenses] = useState<UnitExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUnit) return;
    
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await expensesService.getUnitExpenses(selectedUnit);
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [selectedUnit]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, expenseId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingId(expenseId);
      await expensesService.uploadPaymentProof(expenseId, file);
      alert('Comprobante subido exitosamente. Esperando validación de la administración.');
      
      // Update local state to reflect the uploaded file
      setExpenses(prev => prev.map(exp => 
        exp.id === expenseId ? { ...exp, payment_proof_url: 'pending_validation' } : exp
      ));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir comprobante.');
    } finally {
      setUploadingId(null);
    }
  };

  if (!userUnits.length) {
    return (
      <div className="text-center py-12">
        <Receipt className="h-12 w-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No tenés departamentos asignados para ver expensas.</p>
      </div>
    );
  }

  // Calculate debt metrics
  const pendingExpenses = expenses.filter(e => e.status === 'pending' || e.status === 'partial');
  const totalDebt = pendingExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const nextDueDate = pendingExpenses.length > 0 
    ? [...pendingExpenses].sort((a, b) => new Date(a.expenses!.due_date).getTime() - new Date(b.expenses!.due_date).getTime())[0].expenses!.due_date
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Mis Expensas
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Estado de cuenta y comprobantes de pago
          </p>
        </div>
        
        {userUnits.length > 1 && (
          <div className="w-full sm:w-48">
            <label className="text-xs font-medium text-text-secondary mb-1 block">Unidad</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full rounded-[--radius-md] border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {userUnits.map(uu => (
                <option key={uu.unit_id} value={uu.unit_id}>
                  {formatUnit(uu.units.floor, uu.units.unit)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingScreen message="Cargando estado de cuenta..." />
      ) : (
        <div className="space-y-6 stagger-children">
          {/* Debt Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="lg" className="bg-gradient-to-br from-primary-900 to-primary-800 text-white border-none shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary-100 text-sm font-medium">Saldo Adeudado</p>
                  <h2 className="font-display text-4xl font-bold mt-2 mb-1">
                    {formatCurrency(totalDebt)}
                  </h2>
                  <p className="text-primary-200 text-xs">
                    {pendingExpenses.length} período(s) pendiente(s)
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>

            <Card padding="lg" className="flex flex-col justify-center border-border">
              {totalDebt > 0 && nextDueDate ? (
                <>
                  <div className="flex items-center gap-2 text-warning-600 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold text-sm">Próximo Vencimiento</span>
                  </div>
                  <p className="text-xl font-medium text-text-primary">
                    {new Date(nextDueDate).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    Abonar antes de la fecha para evitar punitorios.
                  </p>
                </>
              ) : (
                <div className="text-center flex flex-col items-center justify-center h-full">
                  <div className="h-12 w-12 rounded-full bg-success-50 flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-success-600" />
                  </div>
                  <p className="font-medium text-text-primary">¡Todo al día!</p>
                  <p className="text-sm text-text-secondary">No registrás deuda en esta unidad.</p>
                </div>
              )}
            </Card>
          </div>

          {/* History List */}
          <div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-3">
              Historial de Expensas
            </h3>
            
            <div className="space-y-3">
              {expenses.length > 0 ? (
                expenses.map((exp) => {
                  const isPending = exp.status === 'pending' || exp.status === 'partial';
                  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                  
                  return (
                    <Card key={exp.id} padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[--radius-md] flex flex-col items-center justify-center shrink-0 ${isPending ? 'bg-warning-50 text-warning-700' : 'bg-success-50 text-success-700'}`}>
                          <span className="text-[10px] font-bold uppercase">{monthNames[exp.expenses!.month - 1].slice(0,3)}</span>
                          <span className="text-xs font-semibold">{exp.expenses!.year}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">
                            Expensas {monthNames[exp.expenses!.month - 1]} {exp.expenses!.year}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {exp.status === 'paid' ? (
                              <Badge variant="success" size="sm">Pagado</Badge>
                            ) : exp.status === 'partial' ? (
                              <Badge variant="warning" size="sm">Pago Parcial</Badge>
                            ) : (
                              <Badge variant="error" size="sm">Pendiente</Badge>
                            )}
                            <span className="text-xs text-text-muted hidden sm:inline">
                              Vence el {formatShortDate(exp.expenses!.due_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2 border-t border-border-light sm:border-t-0 pt-3 sm:pt-0">
                        <span className="font-bold text-lg text-text-primary">
                          {formatCurrency(exp.amount)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {/* Liquidacion PDF Download mock */}
                          {exp.expenses!.pdf_url && (
                            <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />} title="Descargar liquidación" />
                          )}
                          
                          {/* Payment Upload/Status */}
                          {isPending && !exp.payment_proof_url ? (
                            <div className="relative">
                              <input
                                type="file"
                                id={`upload-${exp.id}`}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e, exp.id)}
                                disabled={uploadingId === exp.id}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                icon={<FileUp className="h-4 w-4" />}
                                loading={uploadingId === exp.id}
                              >
                                Informar Pago
                              </Button>
                            </div>
                          ) : isPending && exp.payment_proof_url ? (
                            <Badge variant="info" size="sm">Comprobante en revisión</Badge>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card padding="lg" className="text-center">
                  <p className="text-sm text-text-secondary">No hay expensas registradas para este departamento.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
