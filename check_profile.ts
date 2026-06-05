import { createClient } from '@/lib/supabase/server';

async function main() {
  const supabase = await createClient();
  const userId = '0eaa0706-65d3-4269-a7c3-f63698260da3';
  // 1️⃣ Fetch current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, unit_id, floor, unit, garage_id')
    .eq('id', userId)
    .single();
  console.log('PROFILE BEFORE:', JSON.stringify(profile));
  if (profileError) console.error('PROFILE FETCH ERROR', profileError);

  // 2️⃣ Ensure a unit exists for floor 6, unit C (adjust as needed)
  const floor = '6';
  const unitNumber = 'C';
  const { data: existingUnit, error: unitSearchError } = await supabase
    .from('units')
    .select('id, floor, unit_number, building_id')
    .eq('floor', floor)
    .eq('unit_number', unitNumber)
    .single();
  let unitId = existingUnit?.id;
  if (!unitId) {
    // Need a building_id – pick any existing one (take first unit's building_id if any)
    const { data: anyUnit, error: anyErr } = await supabase.from('units').select('building_id').limit(1).single();
    const buildingId = anyUnit?.building_id || '00000000-0000-0000-0000-000000000000';
    const { data: newUnit, error: insertErr } = await supabase
      .from('units')
      .insert({ building_id: buildingId, floor, unit_number: unitNumber })
      .select()
      .single();
    if (insertErr) {
      console.error('UNIT INSERT ERROR', insertErr);
    } else {
      unitId = newUnit.id;
      console.log('CREATED UNIT:', JSON.stringify(newUnit));
    }
  } else {
    console.log('FOUND EXISTING UNIT:', JSON.stringify(existingUnit));
  }

  // 3️⃣ Update profile with unit_id (if not already set)
  if (unitId && (!profile?.unit_id || profile?.unit_id !== unitId)) {
    const { data: updatedProfile, error: updateErr } = await supabase
      .from('profiles')
      .update({ unit_id: unitId, floor, unit: unitNumber })
      .eq('id', userId)
      .select()
      .single();
    if (updateErr) console.error('PROFILE UPDATE ERROR', updateErr);
    else console.log('PROFILE UPDATED:', JSON.stringify(updatedProfile));
  }

  // 4️⃣ Verify final state
  const { data: finalProfile, error: finalErr } = await supabase
    .from('profiles')
    .select('id, unit_id, floor, unit, garage_id')
    .eq('id', userId)
    .single();
  console.log('FINAL PROFILE:', JSON.stringify(finalProfile, null, 2));
  if (finalErr) console.error('FINAL FETCH ERROR', finalErr);
}

main();
