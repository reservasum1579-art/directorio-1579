import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: units } = await supabase.from('units').select('*');
  console.log('Units:', units?.length, units?.slice(0, 3));
  
  const { data: exp } = await supabase.from('expenses_units').select('*').limit(5);
  console.log('expenses_units schema:', exp?.length > 0 ? Object.keys(exp[0]) : 'no data');
  console.log('expenses_units data:', exp);
}
run();
