import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: units } = await supabase.from('units').select('*').eq('floor', '6').eq('unit_number', 'C');
  console.log("Unit 6C:", units);
  
  if (units?.length > 0) {
    const unitId = units[0].id;
    const { data: occ } = await supabase.from('unit_occupants').select('*').eq('unit_id', unitId);
    console.log("Occupants of 6C:", occ);
  }
}

check().catch(console.error);
