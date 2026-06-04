import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Get the current user from Supabase auth cookies
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // Obtener la primera unidad disponible (puedes cambiar la lógica)
  const { data: unit, error: unitErr } = await supabase
    .from('units')
    .select('id, floor, unit_number')
    .limit(1)
    .single();
  if (unitErr) {
    return NextResponse.json({ error: 'No se encontró una unidad' }, { status: 404 });
  }

  // Actualizar el perfil del usuario con esa unidad
  const { error: updErr } = await supabase
    .from('profiles')
    .update({ unit_id: unit.id, floor: unit.floor, unit: unit.unit_number })
    .eq('id', user.id);

  if (updErr) {
    return NextResponse.json({ error: 'Error al asignar unidad' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Unidad asignada correctamente', unit });
}
