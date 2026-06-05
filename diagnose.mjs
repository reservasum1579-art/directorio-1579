import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  // Check buildings
  const { data: bld, error: bErr } = await supabase.from('buildings').select('*');
  console.log('Buildings:', JSON.stringify(bld), 'Error:', bErr?.message);

  // Check units (without filter)
  const { data: u1, error: uErr1 } = await supabase.from('units').select('*').limit(5);
  console.log('Units (no filter):', u1?.length, 'Error:', uErr1?.message);

  // Check units with building_id filter
  const BUILDING_ID = 'b0000000-0000-0000-0000-000000000001';
  const { data: u2, error: uErr2 } = await supabase.from('units').select('*').eq('building_id', BUILDING_ID).limit(5);
  console.log('Units (with building_id filter):', u2?.length, 'Error:', uErr2?.message);

  // Check occupants
  const { data: occ } = await supabase.from('unit_occupants').select('*').limit(3);
  console.log('Occupants sample:', JSON.stringify(occ));
}
run();
