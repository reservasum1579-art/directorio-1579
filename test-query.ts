import { createClient } from '@supabase/supabase-js';

// No tengo las variables de entorno, así que necesito leerlas de .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const { data, error } = await supabase
    .from('marketplace_posts')
    .select(`
      *,
      profiles (
        first_name,
        last_name,
        phone,
        avatar_url
      ),
      marketplace_images (
        id,
        image_url,
        sort_order
      )
    `)
    .eq('building_id', '123')
    .in('status', ['approved', 'sold']);

  if (error) {
    console.log('ERROR:', JSON.stringify(error, null, 2));
  } else {
    console.log('SUCCESS');
  }
}

test();
