ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS garage_label text;
