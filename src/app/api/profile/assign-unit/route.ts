import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { unitId } = await req.json();
    if (!unitId) {
      return NextResponse.json({ error: 'unitId required' }, { status: 400 });
    }

    const supabase = await createClient();
    // Obtener el usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 4️⃣  Actualizar o crear el perfil con la unidad
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ unit_id: unitId })
      .eq('id', user.id)
      .select();

    if (!updateError && data && data.length === 0) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ 
          id: user.id, 
          unit_id: unitId,
          building_id: process.env.NEXT_PUBLIC_BUILDING_ID,
          first_name: 'Vecino',
          last_name: ''
        });
        
      if (insertError) {
        console.error('Insert error', insertError);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
      }
    } else if (updateError) {
      console.error('Update error', updateError);
      return NextResponse.json({ error: 'Failed to assign unit' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Unexpected error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
