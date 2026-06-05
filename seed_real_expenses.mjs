import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Read the text block from parse_expenses.mjs
const parseExpensesFile = fs.readFileSync('parse_expenses.mjs', 'utf8');
const textMatch = parseExpensesFile.match(/const text = `([\s\S]+?)`;/);
if (!textMatch) {
  console.error("Could not extract text block from parse_expenses.mjs");
  process.exit(1);
}

const rawText = textMatch[1];
const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

const PERIOD_ID = 'd316e913-c608-429c-bf8b-57cd1b503dee'; // Mayo 2026
const DUE_DATE = '2026-06-11'; // Vence el 11 de Junio

async function run() {
  // 1. Fetch units functional_unit -> id mapping
  const { data: units, error: unitsErr } = await supabase
    .from('units')
    .select('id, functional_unit, floor, unit_number');
  if (unitsErr) throw unitsErr;

  const ufToId = {};
  for (const u of units) {
    ufToId[u.functional_unit] = u.id;
  }

  // 2. Clear existing unit_expenses for this period
  const { error: delErr } = await supabase
    .from('unit_expenses')
    .delete()
    .eq('expense_period_id', PERIOD_ID);
  if (delErr) console.warn('Delete warning:', delErr.message);

  // 3. Parse and insert
  const inserts = [];
  for (const line of lines) {
    const tokens = line.split(/\s+/);
    if (tokens.length < 5) continue;
    const uf = tokens[0];
    const lastToken = tokens[tokens.length - 1];
    
    // Parse the total amount: e.g. "431.582,15" -> 431582.15
    const cleaned = lastToken.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(cleaned);

    const unitId = ufToId[uf];
    if (!unitId) {
      console.warn(`UF ${uf} not found in units table!`);
      continue;
    }

    inserts.push({
      unit_id: unitId,
      expense_period_id: PERIOD_ID,
      amount: amount,
      status: 'pending',
      due_date: DUE_DATE
    });
  }

  const { data, error } = await supabase.from('unit_expenses').insert(inserts).select();
  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log(`Successfully inserted ${data.length} real unit expenses.`);
    console.log('Sample inserted data:', data.slice(0, 3));
  }
}

run().catch(console.error);
