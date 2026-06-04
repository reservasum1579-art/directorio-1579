'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock, X } from 'lucide-react';
import { verifyExpensePaymentAction } from '@/modules/admin/expenses/actions/admin-expenses.actions';
import { useRouter } from 'next/navigation';

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      const supabase = await import('@/lib/supabase/client').then(m => m.createClient());
      const { data, error } = await supabase
        .from('expense_payments')
        .select('*')
        .eq('status', 'pending_review');
      if (!error) setPayments(data);
      setLoading(false);
    }
    fetchPayments();
  }, []);

  const handleVerify = async (id: string) => {
    const result = await verifyExpensePaymentAction(id);
    if (result.success) {
      setPayments(p => p.filter(pmt => pmt.id !== id));
      router.refresh();
    } else {
      alert('Error al confirmar el pago: ' + result.error);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando pagos pendientes...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-text-primary">Verificación de Pagos</h1>
        <Badge variant="default">Pendientes: {payments.length}</Badge>
      </header>

      {payments.length === 0 ? (
        <p className="text-center text-text-muted">No hay pagos pendientes de revisión.</p>
      ) : (
        <Card padding="lg" className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase text-text-muted">
                <th className="px-4 py-2">Unidad</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Comprobante</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-2 font-medium text-text-primary">{p.unit_id}</td>
                  <td className="px-4 py-2">${p.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline flex items-center gap-1">
                      <X className="h-3 w-3" /> Ver
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleVerify(p.id)}
                      className="bg-success-600 hover:bg-success-700 text-white px-4 py-1 rounded-md flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Confirmar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
