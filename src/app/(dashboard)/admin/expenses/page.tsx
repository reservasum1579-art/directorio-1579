import { createClient } from '@/lib/supabase/server';
import { FileText, Upload, Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminExpensesPage() {
  const supabase = await createClient();
  
  const { data: periods } = await supabase
    .from('expenses_periods')
    .select('*')
    .order('period_year', { ascending: false })
    .order('period_month', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Gestión de Expensas</h2>
          <p className="text-text-secondary">Sube las liquidaciones en PDF para que la IA extraiga los datos.</p>
        </div>
        <Link 
          href="/admin/expenses/upload"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg"
        >
          <Upload className="h-5 w-5" /> Nueva Liquidación
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {periods?.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-bold mb-2">No hay liquidaciones</h3>
            <p className="text-gray-500 mb-4">Haz clic en Nueva Liquidación para subir el primer PDF.</p>
          </div>
        ) : (
          periods?.map(p => (
            <div key={p.id} className="flex justify-between items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{p.period_month} / {p.period_year}</h3>
                  <p className="text-sm text-gray-500">Total: ${Number(p.total_expenses).toLocaleString()}</p>
                </div>
              </div>
              <a href={p.pdf_url} target="_blank" className="text-primary-600 font-bold hover:underline">
                Ver PDF Original
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
