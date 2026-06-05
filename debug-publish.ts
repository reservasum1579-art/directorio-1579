import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { DEFAULT_BUILDING_ID } from './src/lib/constants';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const buildingId = DEFAULT_BUILDING_ID;
  console.log('Building ID:', buildingId);

  const extractedData = {
    period_month: 5,
    period_year: 2026,
    total_expenses: 150000,
    ordinary_expenses: 100000,
    extraordinary_expenses: 50000,
    reserve_fund: 0,
    categories: []
  };

  const { data: newPeriod, error: periodError } = await supabase
    .from('expenses_periods')
    .insert({
      building_id: buildingId,
      period_month: extractedData.period_month,
      period_year: extractedData.period_year,
      total_expenses: extractedData.total_expenses,
      ordinary_expenses: extractedData.ordinary_expenses,
      extraordinary_expenses: extractedData.extraordinary_expenses,
      reserve_fund: extractedData.reserve_fund,
      pdf_url: 'http://test.com/pdf',
      insights_text: 'Test insight'
    })
    .select()
    .single();

  if (periodError) {
    console.error('ERROR AL INSERTAR:', periodError);
  } else {
    console.log('INSERCION EXITOSA:', newPeriod.id);
  }
}

main();
