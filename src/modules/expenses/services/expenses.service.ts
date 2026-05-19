import { createClient } from '@/lib/supabase/client';
import type { Expense, UnitExpense, ExpenseAnalysis, ExpenseCategory, ExpenseInsight } from '../types/expenses.types';

export const expensesService = {
  // -----------------------------------------------------
  // USER FUNCTIONS
  // -----------------------------------------------------

  /**
   * Obtiene el historial de expensas de un departamento específico (MOCKED)
   */
  async getUnitExpenses(unitId: string): Promise<UnitExpense[]> {
    return [
      {
        id: 'ue-1', expense_id: 'exp-1', unit_id: unitId, amount: 45000, 
        status: 'pending', created_at: new Date().toISOString(),
        expenses: { year: 2024, month: 5, total_amount: 1500000, due_date: '2024-05-15' }
      },
      {
        id: 'ue-0', expense_id: 'exp-0', unit_id: unitId, amount: 42000, 
        status: 'paid', payment_date: '2024-04-10', created_at: new Date().toISOString(),
        expenses: { year: 2024, month: 4, total_amount: 1450000, due_date: '2024-04-15' }
      }
    ] as any;
  },

  /**
   * Sube un comprobante de pago para una expensa (MOCKED)
   */
  async uploadPaymentProof(unitExpenseId: string, file: File): Promise<string> {
    console.log(`EXPENSAS: Subiendo comprobante para ${unitExpenseId}:`, file.name);
    // Simulamos un delay y devolvemos una URL fake
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'https://placehold.co/400x600?text=Comprobante+Subido';
  },

  // -----------------------------------------------------
  // ANALYSIS FUNCTIONS (NEW)
  // -----------------------------------------------------

  /**
   * Obtiene el análisis completo de un período específico (MOCKED)
   */
  async getExpenseAnalysis(expenseId: string): Promise<ExpenseAnalysis> {
    // Simulamos un delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const categories: ExpenseCategory[] = [
      { id: 'cat-1', expense_id: expenseId, name: 'Sueldos y Cargas', slug: 'sueldos', amount: 650000, previous_amount: 620000, variation: 4.8, is_extraordinary: false },
      { id: 'cat-2', expense_id: expenseId, name: 'Limpieza y Vigilancia', slug: 'limpieza', amount: 320000, previous_amount: 310000, variation: 3.2, is_extraordinary: false },
      { id: 'cat-3', expense_id: expenseId, name: 'Electricidad (Luz)', slug: 'electricidad', amount: 125000, previous_amount: 105000, variation: 19.0, is_extraordinary: false },
      { id: 'cat-4', expense_id: expenseId, name: 'Mantenimiento Ascensor', slug: 'mantenimiento', amount: 85000, previous_amount: 85000, variation: 0, is_extraordinary: false },
      { id: 'cat-5', expense_id: expenseId, name: 'AYSA (Agua)', slug: 'aysa', amount: 95000, previous_amount: 90000, variation: 5.5, is_extraordinary: false },
      { id: 'cat-6', expense_id: expenseId, name: 'Pintura Fachada', slug: 'extra', amount: 225000, previous_amount: 0, variation: 100, is_extraordinary: true },
    ];

    const insights: ExpenseInsight[] = [
      { id: 'in-1', expense_id: expenseId, type: 'warning', message: 'El gasto de electricidad aumentó un 19% respecto al mes pasado.', category_slug: 'electricidad' },
      { id: 'in-2', expense_id: expenseId, type: 'trend', message: 'La morosidad del edificio ha bajado un 5% este período.', category_slug: 'deuda' },
      { id: 'in-3', expense_id: expenseId, type: 'info', message: 'Se incluye un gasto extraordinario por pintura de fachada (Cuota 1/3).', category_slug: 'extra' },
    ];

    return {
      period_id: expenseId,
      total_amount: 1500000,
      previous_total: 1410000,
      variation_percent: 6.38,
      total_debt_building: 245000,
      delinquent_units_count: 4,
      top_category_slug: 'sueldos',
      categories,
      insights
    };
  },

  /**
   * Obtiene datos históricos para gráficos (MOCKED)
   */
  async getHistoricalData(months: number = 6): Promise<any[]> {
    return [
      { name: 'Ene', total: 1200000, deuda: 180000, extra: 0 },
      { name: 'Feb', total: 1250000, deuda: 210000, extra: 0 },
      { name: 'Mar', total: 1380000, deuda: 250000, extra: 150000 },
      { name: 'Abr', total: 1410000, deuda: 280000, extra: 0 },
      { name: 'May', total: 1500000, deuda: 245000, extra: 225000 },
    ];
  },

  // -----------------------------------------------------
  // ADMIN FUNCTIONS
  // -----------------------------------------------------

  /**
   * Obtiene todas las liquidaciones (meses) de expensas del edificio (MOCKED)
   */
  async getBuildingExpenses(buildingId: string): Promise<Expense[]> {
    return [
      { id: 'exp-5', building_id: buildingId, year: 2024, month: 5, total_amount: 1500000, due_date: '2024-05-15', status: 'published', pdf_url: '#' },
      { id: 'exp-4', building_id: buildingId, year: 2024, month: 4, total_amount: 1450000, due_date: '2024-04-15', status: 'published', pdf_url: '#' },
      { id: 'exp-3', building_id: buildingId, year: 2024, month: 3, total_amount: 1400000, due_date: '2024-03-15', status: 'published', pdf_url: '#' }
    ] as any;
  },

  /**
   * Obtiene el desglose de un mes de expensa específico (MOCKED)
   */
  async getExpenseDetails(expenseId: string): Promise<UnitExpense[]> {
    return [
      { id: 'ue-14b', expense_id: expenseId, unit_id: 'u1', amount: 45000, status: 'pending', payment_proof_url: 'https://placehold.co/400x600?text=Comprobante+14B', units: { floor: '14', unit: 'B' } },
      { id: 'ue-4c', expense_id: expenseId, unit_id: 'u2', amount: 38000, status: 'paid', payment_date: '2024-05-05', units: { floor: '4', unit: 'C' } },
      { id: 'ue-8a', expense_id: expenseId, unit_id: 'u3', amount: 41500, status: 'pending', units: { floor: '8', unit: 'A' } },
      { id: 'ue-2d', expense_id: expenseId, unit_id: 'u4', amount: 35000, status: 'pending', units: { floor: '2', unit: 'D' } },
      { id: 'ue-10f', expense_id: expenseId, unit_id: 'u5', amount: 52000, status: 'paid', payment_date: '2024-05-02', units: { floor: '10', unit: 'F' } }
    ] as any;
  },

  /**
   * Confirma la recepción de un pago (MOCKED)
   */
  async verifyPayment(unitExpenseId: string): Promise<void> {
    console.log(`EXPENSAS: Pago ${unitExpenseId} verificado.`);
  }
};
