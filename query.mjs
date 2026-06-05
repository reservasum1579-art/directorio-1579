import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('unit_occupants').select('*');
  console.log('Total occupants:', data?.length);
  if (data?.length > 0) {
    console.log('Sample:', data.slice(0, 5));
  }
}
run();
