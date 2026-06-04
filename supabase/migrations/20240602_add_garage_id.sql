-- Migration: add garage_id to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS garage_id uuid REFERENCES public.units(id);

-- Optional: set existing rows to null (already default)
UPDATE public.profiles SET garage_id = NULL WHERE garage_id IS NULL;
