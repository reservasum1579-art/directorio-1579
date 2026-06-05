import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const updatedInsights = `Estimados vecinos,

Las expensas de este mes ascienden a un total de $12.076.757,71 (compuestas por $11.976.757,71 de expensas ordinarias y $100.000,00 de expensas extraordinarias). Esto representa un incremento del 10.92% respecto a los $10.887.961,57 del mes de Abril. El aumento se ve influenciado principalmente por los gastos de mantenimiento y servicios del consorcio. Seguiremos trabajando para optimizar el presupuesto y velar por la transparencia en la gestión de nuestros recursos.`;

async function run() {
  const { data, error } = await supabase.from('expenses_periods').update({
    total_expenses: 12076757.71,
    ordinary_expenses: 11976757.71,
    extraordinary_expenses: 100000.00,
    insights_text: updatedInsights
  }).eq('id', 'd316e913-c608-429c-bf8b-57cd1b503dee').select();

  if (error) {
    console.error(error);
  } else {
    console.log('Successfully updated Mayo 2026 insights:', data[0].insights_text);
  }
}

run();
