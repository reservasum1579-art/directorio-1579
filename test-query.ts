import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const buildingId = process.env.NEXT_PUBLIC_BUILDING_ID!;
  console.log('Fetching for building:', buildingId);
  
  const { data, error } = await supabase
    .from('marketplace_posts')
    .select(`
      *,
      profiles!marketplace_posts_user_id_fkey ( first_name, last_name, floor, unit, phone ),
      marketplace_images ( id, image_url, sort_order )
    `)
    .eq('building_id', buildingId)
    .in('status', ['approved', 'sold'])
    .order('created_at', { ascending: false });
    
  console.log('Error:', error);
  console.log('Data length:', data?.length);
  if (data && data.length > 0) {
    console.log('First item:', JSON.stringify(data[0], null, 2));
  }
}

main().catch(console.error);
