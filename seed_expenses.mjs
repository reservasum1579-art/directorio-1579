import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Datos reales de la liquidación Mayo 2026 extraídos del texto de expensas
// Formato: { uf: '001', total: 43117.01 }
// UF 001-014: COCHERAS, UF 015-048: DEPARTAMENTOS
const EXPENSE_DATA = [
  { uf: '001', total: 43117.01 },
  { uf: '002', total: 49596.90 },
  { uf: '003', total: 47005.43 },
  { uf: '004', total: 43117.04 },
  { uf: '005', total: 83941.10 },
  { uf: '006', total: 43117.06 },
  { uf: '007', total: 83941.15 },
  { uf: '008', total: 43117.08 },
  { uf: '009', total: 43117.09 },
  { uf: '010', total: 43117.10 },
  { uf: '011', total: 43117.11 },
  { uf: '012', total: 43117.12 },
  { uf: '013', total: 43117.13 },
  { uf: '014', total: 43117.14 },
  { uf: '015', total: 179981.06 },
  { uf: '016', total: 179981.06 },
  { uf: '017', total: 179981.06 },
  { uf: '018', total: 249686.18 },
  { uf: '019', total: 249686.18 },
  { uf: '020', total: 249686.18 },
  { uf: '021', total: 249686.18 },
  { uf: '022', total: 249686.18 },
  { uf: '023', total: 249686.18 },
  { uf: '024', total: 249686.18 },
  { uf: '025', total: 249686.18 },
  { uf: '026', total: 249686.18 },
  { uf: '027', total: 249686.18 },
  { uf: '028', total: 249686.18 },
  { uf: '029', total: 249686.18 },
  { uf: '030', total: 249686.18 },
  { uf: '031', total: 249686.18 },
  { uf: '032', total: 249686.18 },
  { uf: '033', total: 249686.18 },
  { uf: '034', total: 249686.18 },
  { uf: '035', total: 249686.18 },
  { uf: '036', total: 249686.18 },
  { uf: '037', total: 249686.18 },
  { uf: '038', total: 249686.18 },
  { uf: '039', total: 249686.18 },
  { uf: '040', total: 249686.18 },
  { uf: '041', total: 249686.18 },
  { uf: '042', total: 249686.18 },
  { uf: '043', total: 249686.18 },
  { uf: '044', total: 249686.18 },
  { uf: '045', total: 249686.18 },
  { uf: '046', total: 249686.18 },
  { uf: '047', total: 249686.18 },
  { uf: '048', total: 249686.18 },
];

const PERIOD_ID = 'd316e913-c608-429c-bf8b-57cd1b503dee'; // Mayo 2026
const DUE_DATE = '2026-06-11'; // Vence el 11 de Junio

async function seed() {
  console.log('=== Seeding unit_expenses for Mayo 2026 ===\n');

  // 1. Fetch all units from DB to map UF -> unit_id
  const { data: units, error: unitsErr } = await supabase
    .from('units')
    .select('id, functional_unit, floor, unit_number');
  
  if (unitsErr) { console.error('Error fetching units:', unitsErr.message); return; }
  
  const ufMap = {};
  for (const u of units) {
    ufMap[u.functional_unit] = u;
  }
  console.log(`Loaded ${units.length} units from DB.`);

  // 2. Delete existing unit_expenses for this period (clean run)
  const { error: delErr } = await supabase
    .from('unit_expenses')
    .delete()
    .eq('expense_period_id', PERIOD_ID);
  if (delErr) console.warn('Delete existing:', delErr.message);
  else console.log('✓ Cleared existing unit_expenses for this period\n');

  // 3. Insert unit_expenses
  let inserted = 0;
  let failed = 0;

  for (const exp of EXPENSE_DATA) {
    const unit = ufMap[exp.uf];
    if (!unit) {
      console.warn(`✗ UF ${exp.uf} not found in units table`);
      failed++;
      continue;
    }

    const { error } = await supabase.from('unit_expenses').insert({
      unit_id: unit.id,
      expense_period_id: PERIOD_ID,
      amount: exp.total,
      status: 'pending',
      due_date: DUE_DATE,
    });

    if (error) {
      console.error(`✗ UF ${exp.uf} (${unit.floor}/${unit.unit_number}):`, error.message);
      failed++;
    } else {
      console.log(`  ✓ UF ${exp.uf} ${unit.floor === 'PB' ? unit.unit_number : unit.floor+'°'+unit.unit_number} → $${exp.total.toLocaleString('es-AR')}`);
      inserted++;
    }
  }

  console.log(`\n=== FINALIZADO ===`);
  console.log(`unit_expenses insertados: ${inserted}`);
  console.log(`Fallidos: ${failed}`);

  // Verify
  const { data: verify } = await supabase
    .from('unit_expenses')
    .select('id')
    .eq('expense_period_id', PERIOD_ID);
  console.log(`\nVerificación: ${verify?.length} registros en unit_expenses para Mayo 2026`);
}

seed().catch(console.error);
