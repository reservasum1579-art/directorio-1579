'use client';

import { useState } from 'react';
import { Search, Eye, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { expensesService } from '../services/expenses.service';
import type { Expense, UnitExpense } from '../types/expenses.types';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatShortDate, formatUnit } from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/Spinner';

interface AdminExpensesDashboardProps {
  expenses: Expense[];
}

export function AdminExpensesDashboard({ expenses }: AdminExpensesDashboardProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(expenses[0] || null);
  const [unitExpenses, setUnitExpenses] = useState<UnitExpense[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch details when a month is selected
  useState(() => {
    if (selectedExpense) {
      loadDetails(selectedExpense.id);
    }
  });

  async function loadDetails(expenseId: string) {
    setLoadingDetails(true);
    try {
      const data = await expensesService.getExpenseDetails(expenseId);
      setUnitExpenses(data);
    } catch (error) {
      console.error('Error loading expense details:', error);
    } finally {
      setLoadingDetails(false);
    }
  }

  const handleSelectMonth = (expense: Expense) => {
    setSelectedExpense(expense);
    loadDetails(expense.id);
  };

  const handleVerifyPayment = async (unitExpenseId: string) => {
    setProcessingId(unitExpenseId);
    try {
      await expensesService.verifyPayment(unitExpenseId);
      // Update local state
      setUnitExpenses(prev => prev.map(ue => 
        ue.id === unitExpenseId 
          ? { ...ue, status: 'paid', payment_date: new Date().toISOString() } 
          : ue
      ));
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Hubo un error al verificar el pago.');
    } finally {
      setProcessingId(null);
    }
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Gestión de Expensas
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Control de liquidaciones y auditoría de cobranzas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Months Sidebar */}
        <Card padding="none" className="lg:col-span-1 h-fit overflow-hidden">
          <div className="p-4 border-b border-border-light bg-background-warm">
            <h3 className="font-display font-semibold text-text-primary">Liquidaciones</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {expenses.map((exp) => {
              const isSelected = selectedExpense?.id === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => handleSelectMonth(exp)}
                  className={`w-full text-left p-4 border-b border-border-light transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-background-warm border-l-4 border-l-transparent'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-text-primary'}`}>
                      {monthNames[exp.month - 1]} {exp.year}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Vence: {formatShortDate(exp.due_date)}
                    </p>
                  </div>
                  {exp.status === 'published' && <Badge variant="success" size="sm">Pub</Badge>}
                  {exp.status === 'draft' && <Badge variant="default" size="sm">Borrador</Badge>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Details View */}
        <div className="lg:col-span-3 space-y-4">
          {selectedExpense ? (
            <>
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card padding="md">
                  <p className="text-sm text-text-secondary">Emisión Total</p>
                  <p className="text-xl font-bold text-text-primary mt-1">
                    {formatCurrency(selectedExpense.total_amount)}
                  </p>
                </Card>
                <Card padding="md">
                  <p className="text-sm text-text-secondary">Recaudación</p>
                  <p className="text-xl font-bold text-success-600 mt-1">
                    {formatCurrency(unitExpenses.filter(u => u.status === 'paid').reduce((a, b) => a + b.amount, 0))}
                  </p>
                </Card>
                <Card padding="md">
                  <p className="text-sm text-text-secondary">Por Cobrar</p>
                  <p className="text-xl font-bold text-warning-600 mt-1">
                    {formatCurrency(unitExpenses.filter(u => u.status !== 'paid').reduce((a, b) => a + b.amount, 0))}
                  </p>
                </Card>
              </div>

              {/* Units Table */}
              <Card padding="none">
                <div className="p-4 border-b border-border-light flex justify-between items-center bg-background-warm">
                  <h3 className="font-semibold text-text-primary">Estado por Departamento</h3>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      placeholder="Buscar UF..." 
                      className="pl-9 pr-3 py-1.5 text-sm border border-border rounded-[--radius-md] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                {loadingDetails ? (
                  <div className="p-8"><LoadingScreen message="Cargando departamentos..." /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unidad</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Comprobante</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitExpenses.map((ue: any) => {
                        const hasUnverifiedProof = ue.payment_proof_url && ue.status !== 'paid';
                        return (
                          <TableRow key={ue.id}>
                            <TableCell className="font-medium">
                              {formatUnit(ue.units?.floor, ue.units?.unit)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(ue.amount)}
                            </TableCell>
                            <TableCell>
                              {ue.status === 'paid' ? (
                                <Badge variant="success" size="sm">Cobrado</Badge>
                              ) : ue.status === 'partial' ? (
                                <Badge variant="warning" size="sm">Pago Parcial</Badge>
                              ) : (
                                <Badge variant="error" size="sm">Adeudado</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {ue.payment_proof_url ? (
                                <a 
                                  href={ue.payment_proof_url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className={`flex items-center gap-1.5 text-xs font-medium hover:underline ${hasUnverifiedProof ? 'text-warning-600' : 'text-primary-600'}`}
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  Ver recibo
                                </a>
                              ) : (
                                <span className="text-xs text-text-muted italic">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {ue.status !== 'paid' ? (
                                <Button
                                  size="sm"
                                  variant={hasUnverifiedProof ? 'primary' : 'outline'}
                                  className={hasUnverifiedProof ? 'bg-success-600 hover:bg-success-700' : ''}
                                  onClick={() => handleVerifyPayment(ue.id)}
                                  loading={processingId === ue.id}
                                >
                                  Marcar Pagado
                                </Button>
                              ) : (
                                <span className="text-xs text-text-muted flex items-center gap-1">
                                  <CheckCircle className="h-3.5 w-3.5 text-success-500" />
                                  Verificado
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </>
          ) : (
            <Card padding="lg" className="text-center h-full flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-10 w-10 text-text-muted mb-3" />
              <p className="text-text-secondary">Seleccioná un mes de liquidación para ver el detalle de cobranzas.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
