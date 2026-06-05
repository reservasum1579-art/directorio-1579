import { config } from 'dotenv';
import { createClient } from '@/lib/supabase/server';

config({ path: '.env.local' });

async function main() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('units')
    .select('id, floor, unit_number')
    .order('floor');

  if (error) {
    console.error('Error fetching units:', error);
    process.exit(1);
  }

  console.log('Units data:', JSON.stringify(data, null, 2));
}

main();
