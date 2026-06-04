-- Add missing columns to units table
ALTER TABLE public.units
  ADD COLUMN IF NOT EXISTS parking TEXT,
  ADD COLUMN IF NOT EXISTS functional_unit TEXT;
