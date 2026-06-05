-- Create admin_requests table for user → admin communication
CREATE TABLE IF NOT EXISTS public.admin_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,           -- e.g. 'email_change', 'unit_change', 'other'
  message text NOT NULL,        -- user's message/details
  status text NOT NULL DEFAULT 'pending',  -- pending | resolved | rejected
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_note text
);

ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- Users can insert their own requests
CREATE POLICY admin_requests_user_insert ON public.admin_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can see their own requests; admins can see all
CREATE POLICY admin_requests_select ON public.admin_requests
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can update (resolve) requests
CREATE POLICY admin_requests_admin_update ON public.admin_requests
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
