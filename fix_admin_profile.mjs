import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  // 1. Get auth user with this email
  const { data: { users }, error: userErr } = await supabase.auth.admin.listUsers();
  if (userErr) { console.error(userErr); return; }

  const me = users.find(u => u.email === 'rpatricio.kenny@gmail.com');
  if (!me) { console.log('User not found in auth'); return; }
  console.log('Auth user:', me.id, me.email);

  // 2. Get my unit (6C = floor 6, unit_number C)
  const { data: unit6c } = await supabase.from('units').select('id').eq('floor', '6').eq('unit_number', 'C').single();
  console.log('Unit 6C:', unit6c);

  // 3. Check current profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', me.id).single();
  console.log('Current profile:', profile);

  if (!profile) {
    // Create it
    const { error } = await supabase.from('profiles').insert({
      id: me.id,
      first_name: 'Patricio',
      last_name: 'Kenny',
      role: 'admin',
      unit_id: unit6c?.id,
      building_id: 'b0000000-0000-0000-0000-000000000001',
    });
    if (error) console.error('Create profile error:', error);
    else console.log('✓ Profile created for admin!');
  } else {
    // Update unit_id if missing
    const { error } = await supabase.from('profiles').update({
      unit_id: unit6c?.id,
      first_name: 'Patricio',
      last_name: 'Kenny',
      role: 'admin',
    }).eq('id', me.id);
    if (error) console.error('Update error:', error);
    else console.log('✓ Profile updated with unit_id!');
  }

  // 4. Also make sure the 6C occupant is_primary = true for consistency
  if (unit6c) {
    const { data: occupants } = await supabase.from('unit_occupants').select('*').eq('unit_id', unit6c.id);
    console.log('Occupants of 6C:', occupants);
  }
}

fix().catch(console.error);
