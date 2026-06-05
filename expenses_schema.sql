-- 1. UNITS TABLE (Departamentos)
CREATE TABLE IF NOT EXISTS public.units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL,
  floor text NOT NULL,
  unit_number text NOT NULL,
  coefficient numeric DEFAULT 1.0, -- Porcentaje de participación (ej: 1.5%)
  created_at timestamp DEFAULT now()
);

-- Vincular los perfiles a las unidades (Opcional, pero recomendado)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unit_id uuid REFERENCES public.units(id);

-- 2. EXPENSES PERIODS (Liquidación Mensual)
CREATE TABLE IF NOT EXISTS public.expenses_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL,
  period_month integer NOT NULL,
  period_year integer NOT NULL,
  
  total_expenses numeric,
  ordinary_expenses numeric,
  extraordinary_expenses numeric,
  reserve_fund numeric,
  total_collection numeric,
  
  pdf_url text,
  insights_text text, -- Explicación generada por IA
  
  created_at timestamp DEFAULT now()
);

-- 3. EXPENSE CATEGORIES (Detalle por categoría)
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_period_id uuid REFERENCES public.expenses_periods(id) ON DELETE CASCADE,
  category_name text NOT NULL,
  amount numeric NOT NULL,
  percentage numeric
);

-- 4. UNIT EXPENSES (Expensa individual por departamento)
CREATE TABLE IF NOT EXISTS public.unit_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_period_id uuid REFERENCES public.expenses_periods(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
  
  amount numeric NOT NULL,
  balance numeric DEFAULT 0,
  status text DEFAULT 'pending', -- pending, paid, overdue
  due_date date,
  
  created_at timestamp DEFAULT now()
);

-- 5. EXPENSE PAYMENTS (Pagos informados)
CREATE TABLE IF NOT EXISTS public.expense_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
  expense_period_id uuid REFERENCES public.expenses_periods(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id), -- Quien informó el pago
  
  amount numeric NOT NULL,
  payment_date timestamp NOT NULL,
  receipt_url text NOT NULL,
  status text DEFAULT 'pending_review', -- pending_review, approved, rejected
  
  created_at timestamp DEFAULT now()
);

-- DESACTIVAR RLS TEMPORALMENTE (Para evitar bloqueos iniciales en el MVP)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses_periods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_payments DISABLE ROW LEVEL SECURITY;

-- CREAR BUCKETS DE STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('expenses-pdfs', 'expenses-pdfs', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('expense-receipts', 'expense-receipts', true) ON CONFLICT DO NOTHING;

-- PERMITIR SUBIR ARCHIVOS (Políticas temporales para MVP)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('expenses-pdfs', 'expense-receipts') );
CREATE POLICY "Upload Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id IN ('expenses-pdfs', 'expense-receipts') );
