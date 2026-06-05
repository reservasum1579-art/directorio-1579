import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { DEFAULT_BUILDING_ID } from './src/lib/constants';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('Creando departamento de prueba...');

  // 2. Crear la unidad "6° C" con un coeficiente de 1.5%
  const { data: newUnit, error: unitError } = await supabase
    .from('units')
    .insert({
      building_id: DEFAULT_BUILDING_ID,
      floor: '6',
      unit_number: 'C',
      coefficient: 1.5
    })
    .select()
    .single();

  if (unitError) {
    console.error('Error al crear la unidad:', unitError);
    return;
  }

  console.log('¡Éxito! Unidad 6° C creada con ID:', newUnit.id);
}

main();
