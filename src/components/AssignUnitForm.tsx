'use client';
// src/components/AssignUnitForm.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
// Using native <select> instead of missing UI component
import { createClient } from '@/lib/supabase/client';

/**
 * Simple form that lets the user pick a unit (by UUID) and calls the
 * `/api/profile/assign‑unit` endpoint to store it in the `profiles` table.
 *
 * Usage example (e.g. in `src/app/(dashboard)/profile/page.tsx`):
 *   import AssignUnitForm from '@/components/AssignUnitForm';
 *   ...
 *   <AssignUnitForm />
 */
export default function AssignUnitForm({ onAssigned }: { onAssigned?: () => void }) {
  const [units, setUnits] = useState<Array<{ id: string; floor: string; unit_number: string }>>([]);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Load available units once on mount
  useEffect(() => {
    async function fetchUnits() {
      const { data, error } = await supabase.from('units').select('id, floor, unit_number');
      if (error) {
        console.error('Error loading units', error);
        setStatus('No se pudieron cargar las unidades');
      } else {
        setUnits(data || []);
      }
    }
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setStatus(null);
    const res = await fetch('/api/profile/assign-unit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId: selected }),
    });
    const json = await res.json();
    if (json.success) {
      setStatus('✅ Unidad asignada correctamente');
      if (onAssigned) onAssigned();
    } else {
      setStatus(`❌ ${json.error || 'Error inesperado'}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-background-warm/30">
      <h3 className="font-bold text-lg text-text-primary">Asignar mi unidad</h3>
      <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="w-full bg-background-warm/50 border border-border-light rounded-xl px-4 py-2.5"
        >
          <option value="" disabled>
            -- Elegir unidad --
          </option>
          {units.map(u => (
            <option key={u.id} value={u.id}>
              Piso {u.floor} – {u.unit_number}
            </option>
          ))}
        </select>
      <Button type="submit" disabled={loading || !selected} loading={loading} className="bg-primary-600 hover:bg-primary-700 text-white">
        Asignar unidad
      </Button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
}
