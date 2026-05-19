// ============================================
// Expenses Module Type Definitions
// ============================================

export type ExpenseStatus = 'draft' | 'published' | 'closed';
export type UnitExpenseStatus = 'pending' | 'paid' | 'partial';

export interface Expense {
  id: string;
  building_id: string;
  month: number;
  year: number;
  total_amount: number;
  due_date: string; // YYYY-MM-DD
  pdf_url: string | null;
  status: ExpenseStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategory {
  id: string;
  expense_id: string;
  name: string;
  slug: string; // sueldos, limpieza, mantenimiento, etc.
  amount: number;
  previous_amount: number;
  variation: number; // porcentaje
  is_extraordinary: boolean;
}

export interface ExpenseInsight {
  id: string;
  expense_id: string;
  type: 'info' | 'warning' | 'trend';
  message: string;
  category_slug?: string;
}

export interface UnitExpense {
  id: string;
  expense_id: string;
  unit_id: string;
  amount: number;
  status: UnitExpenseStatus;
  payment_date: string | null;
  payment_proof_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined relations
  expenses?: Expense;
  units?: {
    floor: string;
    unit: string;
  };
}

export interface ExpenseAnalysis {
  period_id: string;
  total_amount: number;
  previous_total: number;
  variation_percent: number;
  total_debt_building: number;
  delinquent_units_count: number;
  top_category_slug: string;
  insights: ExpenseInsight[];
  categories: ExpenseCategory[];
}

export interface UnitDebtSummary {
  unit_id: string;
  floor: string;
  unit: string;
  total_debt: number;
  pending_months: number;
}
