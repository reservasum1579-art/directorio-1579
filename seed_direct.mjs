import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// IMPORTANT: Use the Service Role Key to bypass RLS!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || 'b0000000-0000-0000-0000-000000000001';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not defined. Using anon key. This may fail due to RLS.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Full data from expenses
const UNITS = [
  { uf: '001', floor: 'PB', unit: 'COCH 1',  name: 'LEON SUSANA',       parking: 'COCH 1'  },
  { uf: '002', floor: 'PB', unit: 'COCH 2',  name: 'CHOI MICAELA',      parking: 'COCH 2'  },
  { uf: '003', floor: 'PB', unit: 'COCH 3',  name: 'BONFILI DAMIAN',    parking: 'COCH 3'  },
  { uf: '004', floor: 'PB', unit: 'COCH 4',  name: 'PACHECO JOSE',      parking: 'COCH 4'  },
  { uf: '005', floor: 'PB', unit: 'COCH 5',  name: 'CASTIGLIA NICOL',   parking: 'COCH 5'  },
  { uf: '006', floor: 'PB', unit: 'COCH 6',  name: 'BARSAMAYAN SEBA',   parking: 'COCH 6'  },
  { uf: '007', floor: 'PB', unit: 'COCH 7',  name: 'MARZELLA NESTOR',   parking: 'COCH 7'  },
  { uf: '008', floor: 'PB', unit: 'COCH 8',  name: 'PONTIERI MARIA',    parking: 'COCH 8'  },
  { uf: '009', floor: 'PB', unit: 'COCH 9',  name: 'PANE ARNALDO',      parking: 'COCH 9'  },
  { uf: '010', floor: 'PB', unit: 'COCH 10', name: 'LASCA',             parking: 'COCH 10' },
  { uf: '011', floor: 'PB', unit: 'COCH 11', name: 'FLORIO ALBERTO',    parking: 'COCH 11' },
  { uf: '012', floor: 'PB', unit: 'COCH 12', name: 'FABIANO CARLA',     parking: 'COCH 12' },
  { uf: '013', floor: 'PB', unit: 'COCH 13', name: 'SPOSATO PABLO',     parking: 'COCH 13' },
  { uf: '014', floor: 'PB', unit: 'COCH 14', name: 'CASTIGLIA FLORE',   parking: 'COCH 14' },
  { uf: '015', floor: '1',  unit: 'A',       name: 'MUÑOZ LORENA',      parking: null },
  { uf: '016', floor: '1',  unit: 'C',       name: 'BUCCIARDI JORGE',   parking: null },
  { uf: '017', floor: '1',  unit: 'D',       name: 'PONTIERI MARIA',    parking: null },
  { uf: '018', floor: '2',  unit: 'A',       name: 'ALVAREZ RODRIGO',   parking: null },
  { uf: '019', floor: '2',  unit: 'B',       name: 'SERVENTE ANA',      parking: null },
  { uf: '020', floor: '2',  unit: 'C',       name: 'CONCILIO DANIEL',   parking: null },
  { uf: '021', floor: '2',  unit: 'D',       name: 'RODRIGUEZ MARCO',   parking: null },
  { uf: '022', floor: '3',  unit: 'A',       name: 'MARZELLA JORGE',    parking: null },
  { uf: '023', floor: '3',  unit: 'B',       name: 'FABIANO CARLA',     parking: null },
  { uf: '024', floor: '3',  unit: 'C',       name: 'RODRIGUEZ M',       parking: null },
  { uf: '025', floor: '3',  unit: 'D',       name: 'POCQUET CECILIA',   parking: null },
  { uf: '026', floor: '4',  unit: 'A',       name: 'RODRIGUEZ MARCOS',  parking: null },
  { uf: '027', floor: '4',  unit: 'B',       name: 'CALLIPARI DANIEL',  parking: null },
  { uf: '028', floor: '4',  unit: 'C',       name: 'GOIOSA ALEXAND',    parking: null },
  { uf: '029', floor: '4',  unit: 'D',       name: 'PAIK VICTOR',       parking: null },
  { uf: '030', floor: '5',  unit: 'A',       name: 'GERACE/ PANE',      parking: null },
  { uf: '031', floor: '5',  unit: 'B',       name: 'ORTS EDUARDO',      parking: null },
  { uf: '032', floor: '5',  unit: 'C',       name: 'NOYA VICTORIA',     parking: null },
  { uf: '033', floor: '5',  unit: 'D',       name: 'GIOACCHINI GUIL',   parking: null },
  { uf: '034', floor: '6',  unit: 'A',       name: 'BARSAMAYAN SEBA',   parking: null },
  { uf: '035', floor: '6',  unit: 'B',       name: 'CARRINO BEATRIZ',   parking: null },
  { uf: '036', floor: '6',  unit: 'C',       name: 'LEON SUSANA',       parking: null },
  { uf: '037', floor: '6',  unit: 'D',       name: 'SUAREZ GRACIELA',   parking: null },
  { uf: '038', floor: '7',  unit: 'A',       name: 'BONFILI DAMIAN',    parking: null },
  { uf: '039', floor: '7',  unit: 'B',       name: 'WESTREPP FLOREN',   parking: null },
  { uf: '040', floor: '7',  unit: 'C',       name: 'SPOSATO PABLO',     parking: null },
  { uf: '041', floor: '7',  unit: 'D',       name: 'CHOI MICAELA',      parking: null },
  { uf: '042', floor: '8',  unit: 'A',       name: 'CASTIGLIA FLORE',   parking: null },
  { uf: '043', floor: '8',  unit: 'B',       name: 'WADDLE GERMAN',     parking: null },
  { uf: '044', floor: '8',  unit: 'C',       name: 'LASCA',             parking: null },
  { uf: '045', floor: '8',  unit: 'D',       name: 'KURINGUIAN GRAC',   parking: null },
  { uf: '046', floor: '9',  unit: 'A',       name: 'PACHECO JOSE',      parking: null },
  { uf: '047', floor: '9',  unit: 'C',       name: 'CASTIGLIA NICOL',   parking: null },
  { uf: '048', floor: '9',  unit: 'D',       name: 'CARELLA GUSTAVO',   parking: null },
];

async function seed() {
  console.log('=== Iniciando seed directo a Supabase con Service Role ===\n');

  // 0. Disable RLS just in case (we are using service role so it bypasses anyway, but good measure)
  // Can't run raw SQL easily via client without RPC, but service role ignores RLS.

  // Ensure Building exists
  const { error: bldErr } = await supabase.from('buildings').upsert({ id: BUILDING_ID, name: 'Directorio 1579', address: 'Directorio 1579' });
  if (bldErr) {
    console.error("Failed to upsert building. Might be missing table?", bldErr.message);
    // Ignore and proceed, we'll try to insert units without it if we can.
  } else {
    console.log('✓ Edificio principal asegurado');
  }

  // 1. Desconectar perfiles
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ unit_id: null, garage_id: null })
    .not('id', 'is', null);
  if (profileErr) console.warn('profiles update:', profileErr.message);
  else console.log('✓ Perfiles desvinculados');

  // 2. Borrar datos dependientes
  for (const table of ['unit_occupants', 'unit_pets', 'unit_vehicles']) {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) console.warn(`${table} delete:`, error.message);
    else console.log(`✓ ${table} borrado`);
  }

  // 3. Borrar unidades
  const { error: unitsDelErr } = await supabase.from('units').delete().not('id', 'is', null);
  if (unitsDelErr) console.warn('units delete:', unitsDelErr.message);
  else console.log('✓ Unidades borradas');

  // 4. Insertar unidades
  let insertedCount = 0;
  let failedCount = 0;
  
  for (const u of UNITS) {
    const unitPayload = {
      building_id: BUILDING_ID,
      floor: u.floor,
      unit_number: u.unit,
      functional_unit: u.uf,
      parking: u.parking,
      coefficient: u.floor === 'PB' ? 0.36 : 1.5,
    };

    const { data: newUnit, error: unitErr } = await supabase
      .from('units')
      .insert(unitPayload)
      .select('id')
      .single();

    if (unitErr) {
      console.error(`✗ Unidad ${u.uf} (${u.floor}/${u.unit}):`, unitErr.message);
      failedCount++;
      continue;
    }

    // 5. Insertar ocupante principal
    const { error: occErr } = await supabase
      .from('unit_occupants')
      .insert({
        unit_id: newUnit.id,
        name: u.name,
        email: `${u.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        phone: '11 ---- ----',
        relationship: 'owner',
        is_primary: true,
      });

    if (occErr) console.warn(`  Ocupante ${u.name}:`, occErr.message);
    
    insertedCount++;
    process.stdout.write(`  ✓ ${u.uf} ${u.floor === 'PB' ? u.unit : u.floor+'°'+u.unit} - ${u.name}\n`);
  }

  console.log(`\n=== FINALIZADO ===`);
  console.log(`Unidades insertadas: ${insertedCount}`);
  console.log(`Fallidas: ${failedCount}`);

  // 6. Verificar
  const { data: verify } = await supabase.from('units').select('id, floor, unit_number');
  console.log(`\nVerificación final - Unidades en DB: ${verify?.length}`);
}

seed().catch(console.error);
