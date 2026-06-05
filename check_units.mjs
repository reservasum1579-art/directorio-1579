import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: units, error: uError } = await supabase.from('units').select('*');
  console.log('Units:', units?.length, uError);
  
  const { data: occ, error: oError } = await supabase.from('unit_occupants').select('*');
  console.log('Occupants:', occ?.length, oError);
}
run();
