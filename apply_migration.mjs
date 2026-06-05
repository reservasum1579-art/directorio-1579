const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { error: testError } = await supabase.from('admin_requests').select('id').limit(1);
  
  if (!testError) {
    console.log('admin_requests table already exists!');
    return;
  }
  
  console.log('Table does not exist:', testError.message);
  console.log('');
  console.log('Please run this SQL in your Supabase dashboard (SQL Editor):');
  console.log('https://supabase.com/dashboard/project/gdsxxewdpnupcboskhmm/sql/new');
  console.log('');
  console.log(`
CREATE TABLE IF NOT EXISTS public.admin_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_note text
);

ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_requests_insert ON public.admin_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY admin_requests_select ON public.admin_requests
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY admin_requests_update ON public.admin_requests
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
  `);
}

run();
