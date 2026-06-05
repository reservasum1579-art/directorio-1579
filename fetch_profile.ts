import { createClient } from './src/lib/supabase/server';

async function main() {
  const supabase = await createClient();
  const userId = '0eaa0706-65d3-4269-a7c3-f63698260da3';
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  console.log('PROFILE:', JSON.stringify(profile, null, 2));
  if (error) console.error('ERROR:', error);
}

main();
