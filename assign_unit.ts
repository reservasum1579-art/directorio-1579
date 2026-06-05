import { createClient } from './src/lib/supabase/server';

// Cambia este UID por el de tu usuario
const USER_ID = '0eaa0706-65d3-4269-a7c3-f63698260da3';

async function assignFirstUnit() {
  const supabase = await createClient();

  // 1️⃣ Obtener la primera unidad disponible (puedes ajustar la lógica)
  const { data: unit, error: unitErr } = await supabase
    .from('units')
    .select('id, floor, unit_number')
    .limit(1)
    .single();
  if (unitErr) {
    console.error('Error al obtener unidad:', unitErr);
    return;
  }

  // 2️⃣ Actualizar el perfil del usuario con esa unidad
  const { data: updated, error: updErr } = await supabase
    .from('profiles')
    .update({
      unit_id: unit.id,
      floor: unit.floor,
      unit: unit.unit_number,
    })
    .eq('id', USER_ID)
    .select();

  if (updErr) {
    console.error('Error al actualizar perfil:', updErr);
    return;
  }

  console.log('Perfil actualizado con la unidad:', updated);
}

assignFirstUnit();
