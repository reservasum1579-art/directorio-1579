import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: units } = await supabase.from('units').select('*');
  console.log('Total Units:', units?.length);
  
  // Try authenticating
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'rpatricio.kenny@gmail.com',
    password: 'password123' // Or something? I can't guess.
  });
  
  const { data: unitsAuth } = await supabase.from('units').select('*');
  console.log('Units with Auth:', unitsAuth?.length);
}
run();
